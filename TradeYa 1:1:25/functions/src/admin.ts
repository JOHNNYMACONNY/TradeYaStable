import * as functions from 'firebase-functions';
import { auth } from 'firebase-admin';

export const setAdminRole = functions.https.onCall(async (data, context) => {
  // Verify the requester is already an admin
  if (!context.auth?.token.admin) {
    throw new functions.https.HttpsError(
      'permission-denied',
      'Only admins can add other admins'
    );
  }

  const { email } = data;
  if (!email) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Email is required'
    );
  }

  try {
    // Get user by email
    const user = await auth.getUserByEmail(email);
    
    // Set admin claim
    await auth.setCustomUserClaims(user.uid, { admin: true });
    
    return { success: true };
  } catch (error) {
    console.error('Error setting admin role:', error);
    throw new functions.https.HttpsError(
      'internal',
      'Failed to set admin role'
    );
  }
});

export const removeAdminRole = functions.https.onCall(async (data, context) => {
  // Verify the requester is an admin
  if (!context.auth?.token.admin) {
    throw new functions.https.HttpsError(
      'permission-denied',
      'Only admins can remove admin privileges'
    );
  }

  const { email } = data;
  if (!email) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Email is required'
    );
  }

  try {
    // Get user by email
    const user = await auth.getUserByEmail(email);
    
    // Remove admin claim
    await auth.setCustomUserClaims(user.uid, { admin: false });
    
    return { success: true };
  } catch (error) {
    console.error('Error removing admin role:', error);
    throw new functions.https.HttpsError(
      'internal',
      'Failed to remove admin role'
    );
  }
});