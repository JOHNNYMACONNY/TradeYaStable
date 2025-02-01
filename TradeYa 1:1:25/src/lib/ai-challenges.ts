import { HfInference } from '@huggingface/inference';
import { Challenge } from '../types';
import { 
  collection, 
  doc, 
  writeBatch,
  serverTimestamp,
  Timestamp,
  query,
  where,
  getDocs,
  addDoc
} from 'firebase/firestore';
import { db } from './firebase';
import { showError } from './alerts';

// Initialize Hugging Face client
const API_KEY = import.meta.env.VITE_HUGGINGFACE_API_KEY;
if (!API_KEY) {
  console.error('Missing Hugging Face API key');
}

const hf = new HfInference(API_KEY);

// Template challenges for initialization
const TEMPLATE_CHALLENGES = {
  weekly: [
    {
      title: 'Audio Production Mastery',
      description: 'Share your audio production expertise and learn new techniques. Help others with mixing, mastering, or sound design while expanding your own skills!',
      type: 'weekly',
      requirements: [
        { type: 'trades', count: 2, skillCategory: 'audio-production' },
        { type: 'collaborations', count: 1, skillCategory: 'sound-design' }
      ],
      rewards: { xp: 300, badge: 'audio_master' }
    },
    {
      title: 'Visual Storytelling Challenge',
      description: 'Exchange videography and editing skills to create compelling visual narratives. Learn new techniques while helping others improve their video content.',
      type: 'weekly',
      requirements: [
        { type: 'trades', count: 2, skillCategory: 'video-editing' },
        { type: 'endorsements', count: 3, skillCategory: 'videography' }
      ],
      rewards: { xp: 250, badge: 'visual_storyteller' }
    },
    {
      title: 'Design Sprint',
      description: 'Collaborate on graphic design projects and share your expertise in different design tools and techniques. Help others bring their creative visions to life!',
      type: 'weekly',
      requirements: [
        { type: 'trades', count: 3, skillCategory: 'graphic-design' },
        { type: 'collaborations', count: 1, skillCategory: 'ui-design' }
      ],
      rewards: { xp: 275, badge: 'design_guru' }
    },
    {
      title: 'Content Creator Boost',
      description: 'Share your content creation skills across different mediums. Exchange knowledge in video production, thumbnail design, or motion graphics!',
      type: 'weekly',
      requirements: [
        { type: 'trades', count: 2, skillCategory: 'content-creation' },
        { type: 'endorsements', count: 2, skillCategory: 'motion-graphics' }
      ],
      rewards: { xp: 280, badge: 'content_master' }
    }
  ],
  monthly: [
    {
      title: 'Music Production Journey',
      description: 'Dive deep into music production by exchanging knowledge in composition, arrangement, mixing, and mastering. Build a network of music producers and level up your skills!',
      type: 'monthly',
      requirements: [
        { type: 'trades', count: 3, skillCategory: 'music-production' },
        { type: 'collaborations', count: 2, skillCategory: 'mixing' },
        { type: 'endorsements', count: 5, skillCategory: 'audio-engineering' }
      ],
      rewards: { xp: 1000, badge: 'music_producer_elite' }
    },
    {
      title: 'Film Production Mastery',
      description: 'Master the art of filmmaking through collaborative projects. Exchange skills in cinematography, directing, editing, and post-production.',
      type: 'monthly',
      requirements: [
        { type: 'trades', count: 4, skillCategory: 'film-production' },
        { type: 'collaborations', count: 2, skillCategory: 'post-production' }
      ],
      rewards: { xp: 900, badge: 'film_master' }
    },
    {
      title: 'Brand Design Evolution',
      description: 'Level up your brand design skills by collaborating on comprehensive branding projects. Share expertise in logo design, typography, and brand identity.',
      type: 'monthly',
      requirements: [
        { type: 'trades', count: 3, skillCategory: 'brand-design' },
        { type: 'collaborations', count: 2, skillCategory: 'identity-design' },
        { type: 'endorsements', count: 4, skillCategory: 'logo-design' }
      ],
      rewards: { xp: 950, badge: 'brand_architect' }
    },
    {
      title: 'Digital Art Revolution',
      description: 'Push the boundaries of digital art through skill exchanges and collaborations. Share techniques in illustration, 3D modeling, and digital painting.',
      type: 'monthly',
      requirements: [
        { type: 'trades', count: 3, skillCategory: 'digital-art' },
        { type: 'collaborations', count: 2, skillCategory: '3d-modeling' },
        { type: 'endorsements', count: 4, skillCategory: 'illustration' }
      ],
      rewards: { xp: 1000, badge: 'digital_artist_supreme' }
    }
  ]
};

// Generate a new challenge
export async function generateChallenge(type: 'weekly' | 'monthly', useAI = false): Promise<string> {
  console.log(`Generating ${type} challenge (AI: ${useAI})`);
  
  try {
    let challenge: Partial<Challenge>;
    
    if (useAI) {
      try {
        console.log('Attempting AI challenge generation...');
        const prompt = `Generate a ${type} challenge for a skill-trading platform focused on creative media skills like audio production, video editing, graphic design, etc.
          Format: JSON
          Include:
          - title: engaging title
          - description: motivating description
          - requirements: achievable within ${type === 'weekly' ? '7 days' : 'a month'}
          - rewards: ${type === 'weekly' ? '100-300' : '500-1000'} XP`;

        const response = await hf.textGeneration({
          model: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
          inputs: prompt,
          parameters: {
            max_new_tokens: 500,
            temperature: 0.7,
            return_full_text: false
          }
        });

        const jsonMatch = response.generated_text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
          throw new Error('Invalid AI response format');
        }

        const aiChallenge = JSON.parse(jsonMatch[0]);
        challenge = {
          ...aiChallenge,
          type,
          status: 'pending',
          participants: [],
          completions: []
        };
      } catch (error) {
        console.warn('AI generation failed, falling back to template:', error);
        challenge = getTemplateChallenge(type);
      }
    } else {
      challenge = getTemplateChallenge(type);
    }

    const now = new Date();
    const endDate = new Date(now);
    if (type === 'weekly') {
      endDate.setDate(endDate.getDate() + 7);
    } else {
      endDate.setMonth(endDate.getMonth() + 1);
    }

    const docRef = await addDoc(collection(db, 'challenges'), {
      ...challenge,
      startDate: serverTimestamp(),
      endDate: Timestamp.fromDate(endDate),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    console.log(`Challenge created successfully with ID: ${docRef.id}`);
    return docRef.id;
  } catch (error) {
    console.error('Failed to generate challenge:', error);
    await showError(
      'Challenge Generation Error',
      'Failed to generate challenge. Please try again later.'
    );
    throw error;
  }
}

// Get a template challenge
function getTemplateChallenge(type: 'weekly' | 'monthly'): Partial<Challenge> {
  const templates = TEMPLATE_CHALLENGES[type];
  return templates[Math.floor(Math.random() * templates.length)];
}

// Check and generate new challenges if needed
export async function checkAndGenerateChallenges(): Promise<void> {
  console.log('Checking for existing challenges...');
  
  try {
    // Check weekly challenges
    const weeklyQuery = query(
      collection(db, 'challenges'),
      where('type', '==', 'weekly'),
      where('status', '==', 'pending')
    );
    
    const weeklySnapshot = await getDocs(weeklyQuery);
    console.log(`Found ${weeklySnapshot.size} pending weekly challenges`);
    
    // Check monthly challenges
    const monthlyQuery = query(
      collection(db, 'challenges'),
      where('type', '==', 'monthly'),
      where('status', '==', 'pending')
    );
    
    const monthlySnapshot = await getDocs(monthlyQuery);
    console.log(`Found ${monthlySnapshot.size} pending monthly challenges`);

    // Create new challenges if needed
    if (weeklySnapshot.empty || monthlySnapshot.empty) {
      const batch = writeBatch(db);
      const challengesRef = collection(db, 'challenges');

      const now = new Date();

      if (weeklySnapshot.empty) {
        console.log('Generating new weekly challenge...');
        const weeklyTemplate = TEMPLATE_CHALLENGES.weekly[Math.floor(Math.random() * TEMPLATE_CHALLENGES.weekly.length)];
        const weeklyEndDate = new Date(now);
        weeklyEndDate.setDate(weeklyEndDate.getDate() + 7);
        
        const weeklyDocRef = doc(challengesRef);
        batch.set(weeklyDocRef, {
          ...weeklyTemplate,
          participants: [],
          completions: [],
          status: 'pending',
          startDate: serverTimestamp(),
          endDate: Timestamp.fromDate(weeklyEndDate),
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }

      if (monthlySnapshot.empty) {
        console.log('Generating new monthly challenge...');
        const monthlyTemplate = TEMPLATE_CHALLENGES.monthly[Math.floor(Math.random() * TEMPLATE_CHALLENGES.monthly.length)];
        const monthlyEndDate = new Date(now);
        monthlyEndDate.setMonth(monthlyEndDate.getMonth() + 1);
        
        const monthlyDocRef = doc(challengesRef);
        batch.set(monthlyDocRef, {
          ...monthlyTemplate,
          participants: [],
          completions: [],
          status: 'pending',
          startDate: serverTimestamp(),
          endDate: Timestamp.fromDate(monthlyEndDate),
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }

      await batch.commit();
      console.log('New challenges created successfully');
    }
  } catch (error) {
    console.error('Error checking/generating challenges:', error);
    await showError(
      'Challenge Generation Error',
      'Failed to check or generate challenges. Please try again later.'
    );
    throw error;
  }
}

// Initialize challenges for the first time
export async function initializeChallenges(retries = 3): Promise<void> {
  console.log('Initializing challenges...');
  
  try {
    const batch = writeBatch(db);
    const challengesRef = collection(db, 'challenges');
    
    // Create weekly challenges
    for (const template of TEMPLATE_CHALLENGES.weekly) {
      const now = new Date();
      const endDate = new Date(now);
      endDate.setDate(endDate.getDate() + 7);
      
      const docRef = doc(challengesRef);
      batch.set(docRef, {
        ...template,
        participants: [],
        completions: [],
        status: 'pending',
        startDate: serverTimestamp(),
        endDate: Timestamp.fromDate(endDate),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    }
    
    // Create monthly challenges
    for (const template of TEMPLATE_CHALLENGES.monthly) {
      const now = new Date();
      const monthlyEndDate = new Date(now);
      monthlyEndDate.setMonth(monthlyEndDate.getMonth() + 1);
      
      const monthlyDocRef = doc(challengesRef);
      batch.set(monthlyDocRef, {
        ...template,
        participants: [],
        completions: [],
        status: 'pending',
        startDate: serverTimestamp(),
        endDate: Timestamp.fromDate(monthlyEndDate),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    }
    
    await batch.commit();
    console.log('Initial challenges created successfully');
  } catch (error) {
    console.error('Error in initializeChallenges:', error);
    if (retries > 0) {
      console.log(`Retrying initialization (${retries} attempts remaining)...`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      return initializeChallenges(retries - 1);
    }
    await showError(
      'Challenge Initialization Error',
      'Failed to initialize challenges. Please refresh the page or contact support.'
    );
    throw error;
  }
}