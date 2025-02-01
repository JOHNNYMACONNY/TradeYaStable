import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  updateDoc,
  deleteDoc,
  serverTimestamp,
  Timestamp,
  writeBatch
} from 'firebase/firestore';
import { db } from './firebase';
import { Connection, UserProfile } from '../types';
import { showError, showSuccess } from './alerts';

// Send a connection request
export async function sendConnectionRequest(fromUserId: string, toUserId: string): Promise<void> {
  try {
    // Validate users
    if (!fromUserId || !toUserId) {
      throw new Error('Both user IDs are required');
    }

    if (fromUserId === toUserId) {
      throw new Error('Cannot connect with yourself');
    }

    // Check if users exist
    const [fromUser, toUser] = await Promise.all([
      getDoc(doc(db, 'users', fromUserId)),
      getDoc(doc(db, 'users', toUserId))
    ]);

    if (!fromUser.exists() || !toUser.exists()) {
      throw new Error('One or both users not found');
    }

    // Check for existing connections in both collections
    const [receivedRequest, sentRequest] = await Promise.all([
      getDocs(query(
        collection(db, `users/${toUserId}/connections`),
        where('userId', '==', fromUserId)
      )),
      getDocs(query(
        collection(db, `users/${fromUserId}/sent_requests`),
        where('userId', '==', toUserId)
      ))
    ]);

    if (!receivedRequest.empty || !sentRequest.empty) {
      throw new Error('Connection request already exists');
    }

    // Create connection request in both collections
    const batch = writeBatch(db);
    const timestamp = serverTimestamp();

    // Add to recipient's connections
    batch.set(doc(db, `users/${toUserId}/connections`, `${fromUserId}_${toUserId}`), {
      userId: fromUserId,
      status: 'pending',
      timestamp
    });

    // Add to sender's sent_requests
    batch.set(doc(db, `users/${fromUserId}/sent_requests`, `${fromUserId}_${toUserId}`), {
      userId: toUserId,
      status: 'pending',
      timestamp
    });

    await batch.commit();
    await showSuccess('Request Sent', 'Your connection request has been sent successfully');
  } catch (error) {
    console.error('Error sending connection request:', error);
    await showError(
      'Failed to Send Request',
      error instanceof Error ? error.message : 'An unexpected error occurred'
    );
    throw error;
  }
}

// Get connection status between two users
export async function getConnectionStatus(userId: string, otherUserId: string): Promise<'none' | 'pending' | 'accepted'> {
  try {
    if (!userId || !otherUserId) {
      throw new Error('Both user IDs are required');
    }

    // Check both received and sent requests
    const [receivedRequest, sentRequest] = await Promise.all([
      getDocs(query(
        collection(db, `users/${userId}/connections`),
        where('userId', '==', otherUserId)
      )),
      getDocs(query(
        collection(db, `users/${userId}/sent_requests`),
        where('userId', '==', otherUserId)
      ))
    ]);

    // Check received requests first
    if (!receivedRequest.empty) {
      return receivedRequest.docs[0].data().status as 'pending' | 'accepted';
    }

    // Then check sent requests
    if (!sentRequest.empty) {
      return sentRequest.docs[0].data().status as 'pending' | 'accepted';
    }

    return 'none';
  } catch (error) {
    console.error('Error checking connection status:', error);
    throw error;
  }
}

// Accept a connection request
export async function acceptConnectionRequest(userId: string, connectionId: string): Promise<void> {
  try {
    if (!userId || !connectionId) {
      throw new Error('User ID and connection ID are required');
    }

    const [fromUserId, toUserId] = connectionId.split('_');
    const connectionRef = doc(db, `users/${userId}/connections`, connectionId);
    const connectionDoc = await getDoc(connectionRef);

    if (!connectionDoc.exists()) {
      throw new Error('Connection request not found');
    }

    const connection = connectionDoc.data() as Connection;
    if (connection.status !== 'pending') {
      throw new Error('Connection request is no longer pending');
    }

    const batch = writeBatch(db);
    const timestamp = serverTimestamp();

    // Update received request to accepted
    batch.update(connectionRef, {
      status: 'accepted',
      timestamp
    });

    // Update sent request to accepted
    const sentRequestRef = doc(db, `users/${fromUserId}/sent_requests`, connectionId);
    batch.update(sentRequestRef, {
      status: 'accepted',
      timestamp
    });

    // Create reciprocal connections
    batch.set(doc(db, `users/${fromUserId}/connections`, `${toUserId}_${fromUserId}`), {
      userId: toUserId,
      status: 'accepted',
      timestamp
    });

    batch.set(doc(db, `users/${toUserId}/connections`, `${fromUserId}_${toUserId}`), {
      userId: fromUserId,
      status: 'accepted',
      timestamp
    });

    await batch.commit();
    await showSuccess('Connection Accepted', 'You are now connected!');
  } catch (error) {
    console.error('Error accepting connection request:', error);
    await showError(
      'Failed to Accept Request',
      error instanceof Error ? error.message : 'An unexpected error occurred'
    );
    throw error;
  }
}

// Decline a connection request
export async function declineConnectionRequest(userId: string, connectionId: string): Promise<void> {
  try {
    if (!userId || !connectionId) {
      throw new Error('User ID and connection ID are required');
    }

    const [fromUserId] = connectionId.split('_');
    const batch = writeBatch(db);

    // Remove from connections
    batch.delete(doc(db, `users/${userId}/connections`, connectionId));

    // Remove from sent_requests
    batch.delete(doc(db, `users/${fromUserId}/sent_requests`, connectionId));

    await batch.commit();
    await showSuccess('Connection Declined', 'The connection request has been declined');
  } catch (error) {
    console.error('Error declining connection request:', error);
    await showError(
      'Failed to Decline Request',
      error instanceof Error ? error.message : 'An unexpected error occurred'
    );
    throw error;
  }
}

// Remove a connection
export async function removeConnection(userId: string, connectionId: string): Promise<void> {
  try {
    if (!userId || !connectionId) {
      throw new Error('User ID and connection ID are required');
    }

    const [fromUserId, toUserId] = connectionId.split('_');
    const batch = writeBatch(db);

    // Remove connections from both users
    batch.delete(doc(db, `users/${fromUserId}/connections`, connectionId));
    batch.delete(doc(db, `users/${toUserId}/connections`, `${toUserId}_${fromUserId}`));

    // Remove from sent_requests if they exist
    batch.delete(doc(db, `users/${fromUserId}/sent_requests`, connectionId));
    batch.delete(doc(db, `users/${toUserId}/sent_requests`, `${toUserId}_${fromUserId}`));

    await batch.commit();
    await showSuccess('Connection Removed', 'The connection has been removed from your network');
  } catch (error) {
    console.error('Error removing connection:', error);
    await showError(
      'Failed to Remove Connection',
      error instanceof Error ? error.message : 'An unexpected error occurred'
    );
    throw error;
  }
}