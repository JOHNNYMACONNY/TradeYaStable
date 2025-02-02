import * as functions from 'firebase-functions';
import { HfInference } from '@huggingface/inference';
import { db, withRetry } from './firebase';
import { Challenge } from './types';

// Initialize Hugging Face client
const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

// Cache for challenge templates to avoid redundant API calls
const challengeCache = new Map<string, Challenge>();
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

// Generate challenge using Hugging Face API
async function generateChallengeWithAI(type: 'weekly' | 'monthly'): Promise<Partial<Challenge>> {
  const prompt = `Generate a ${type} challenge for a skill-trading platform.
    Format: JSON
    Guidelines:
    - Title should be engaging
    - Description should be motivating
    - Requirements should be achievable within ${type === 'weekly' ? '7 days' : 'a month'}
    - XP rewards: ${type === 'weekly' ? '100-300' : '500-1000'}
    Include: title, description, requirements (array of {type, count, skillCategory}), rewards (xp, badge)`;

  const response = await hf.textGeneration({
    model: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
    inputs: prompt,
    parameters: {
      max_new_tokens: 500,
      temperature: 0.7,
      return_full_text: false
    }
  });

  try {
    const challenge = JSON.parse(response.generated_text);
    return validateAndCleanChallenge(challenge, type);
  } catch (error) {
    console.error('Failed to parse challenge:', error);
    return getFallbackChallenge(type);
  }
}

// Scheduled function to generate challenges
export const generateWeeklyChallenges = functions.pubsub
  .schedule('every monday 00:00')
  .timeZone('UTC')
  .onRun(async () => {
    return await withRetry(async () => {
      const batch = db.batch();
      
      // Generate 3 weekly challenges
      for (let i = 0; i < 3; i++) {
        const challenge = await generateChallengeWithAI('weekly');
        const docRef = db.collection('challenges').doc();
        
        batch.set(docRef, {
          ...challenge,
          status: 'pending',
          type: 'weekly',
          startDate: null,
          endDate: null,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }

      await batch.commit();
      console.log('Generated weekly challenges successfully');
    });
  });

export const generateMonthlyChallenges = functions.pubsub
  .schedule('0 0 1 * *') // First day of each month
  .timeZone('UTC')
  .onRun(async () => {
    return await withRetry(async () => {
      const batch = db.batch();
      
      // Generate 2 monthly challenges
      for (let i = 0; i < 2; i++) {
        const challenge = await generateChallengeWithAI('monthly');
        const docRef = db.collection('challenges').doc();
        
        batch.set(docRef, {
          ...challenge,
          status: 'pending',
          type: 'monthly',
          startDate: null,
          endDate: null,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }

      await batch.commit();
      console.log('Generated monthly challenges successfully');
    });
  });

// Function to activate pending challenges
export const activateChallenges = functions.pubsub
  .schedule('every 1 hours')
  .onRun(async () => {
    const now = new Date();
    
    // Get pending challenges
    const pendingSnapshot = await db.collection('challenges')
      .where('status', '==', 'pending')
      .get();

    const batch = db.batch();
    let activatedCount = 0;

    pendingSnapshot.docs.forEach(doc => {
      const challenge = doc.data();
      const startDate = new Date();
      const endDate = new Date(startDate);
      
      if (challenge.type === 'weekly') {
        endDate.setDate(endDate.getDate() + 7);
      } else {
        endDate.setMonth(endDate.getMonth() + 1);
      }

      batch.update(doc.ref, {
        status: 'live',
        startDate,
        endDate,
        updatedAt: now
      });
      
      activatedCount++;
    });

    if (activatedCount > 0) {
      await batch.commit();
      console.log(`Activated ${activatedCount} challenges`);
    }
  });

// HTTP function for manual challenge activation
export const manuallyActivateChallenge = functions.https.onCall(async (data, context) => {
  // Verify admin status
  if (!context.auth?.token.admin) {
    throw new functions.https.HttpsError(
      'permission-denied',
      'Only admins can manually activate challenges'
    );
  }

  const { challengeId } = data;
  if (!challengeId) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Challenge ID is required'
    );
  }

  const challengeRef = db.collection('challenges').doc(challengeId);
  const challenge = await challengeRef.get();

  if (!challenge.exists) {
    throw new functions.https.HttpsError(
      'not-found',
      'Challenge not found'
    );
  }

  if (challenge.data()?.status !== 'pending') {
    throw new functions.https.HttpsError(
      'failed-precondition',
      'Challenge is not in pending status'
    );
  }

  const now = new Date();
  const endDate = new Date(now);
  if (challenge.data()?.type === 'weekly') {
    endDate.setDate(endDate.getDate() + 7);
  } else {
    endDate.setMonth(endDate.getMonth() + 1);
  }

  await challengeRef.update({
    status: 'live',
    startDate: now,
    endDate,
    updatedAt: now
  });

  return { success: true };
});