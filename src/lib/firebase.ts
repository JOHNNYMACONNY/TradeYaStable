import { initializeApp } from 'firebase/app';
import { 
  getFirestore,
  enableMultiTabIndexedDbPersistence,
  collection,
  addDoc,
  getDoc,
  doc,
  updateDoc,
  getDocs,
  query,
  QueryConstraint,
  DocumentData,
  FirestoreError,
  Timestamp,
  WriteBatch,
  serverTimestamp,
  Firestore
} from 'firebase/firestore';
import { 
  getAuth, 
  Auth
} from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';
import { showError } from './alerts';

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Validate Firebase config
Object.entries(firebaseConfig).forEach(([key, value]) => {
  if (!value) {
    console.error(`Missing Firebase config: ${key}`);
  }
});

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore and enable persistence
let firestoreDb: Firestore;
let collections: ReturnType<typeof getCollections>;

// Initialize collections helper
const getCollections = (db: Firestore) => ({
  challenges: collection(db, 'challenges'),
  users: collection(db, 'users'),
  trades: collection(db, 'trades'),
  conversations: collection(db, 'conversations'),
  messages: collection(db, 'messages'),
  collaborations: collection(db, 'collaborations')
});

const initializeFirestore = async () => {
  if (!firestoreDb) {
    firestoreDb = getFirestore(app);
    try {
      await enableMultiTabIndexedDbPersistence(firestoreDb);
    } catch (err: any) {
      if (err.code === 'failed-precondition') {
        // Multiple tabs open, persistence can only be enabled in one tab at a time.
        console.warn('Multiple tabs open, persistence enabled in another tab');
      } else if (err.code === 'unimplemented') {
        // The current browser doesn't support persistence
        console.warn('Browser does not support persistence');
      } else {
        console.warn('Failed to enable persistence:', err);
      }
    }
    // Initialize collections after Firestore is ready
    collections = getCollections(firestoreDb);
  }
  return firestoreDb;
};

// Export getters that ensure Firestore is initialized
export const getDb = async () => {
  return await initializeFirestore();
};

export const getCollectionRefs = async () => {
  await initializeFirestore();
  return collections;
};

// Initialize Auth
const auth = getAuth(app);

// Initialize Storage
const storage = getStorage(app);

// Initialize Analytics in production
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

// Enhanced retry utility with exponential backoff
const withRetry = async <T>(
  operation: () => Promise<T>,
  maxRetries = 3,
  baseDelay = 1000,
  onRetry?: (attempt: number, error: Error) => void
): Promise<T> => {
  let lastError: Error | null = null;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      console.error(`Operation failed (attempt ${attempt}/${maxRetries}):`, {
        error: lastError,
        stack: lastError.stack,
        timestamp: new Date().toISOString(),
        code: (error as FirestoreError)?.code
      });
      
      if (attempt === maxRetries) {
        console.error('All retry attempts failed:', {
          totalAttempts: attempt,
          finalError: lastError,
          code: (error as FirestoreError)?.code
        });
        break;
      }
      
      onRetry?.(attempt, lastError);
      
      const delay = baseDelay * Math.pow(2, attempt - 1) * (0.5 + Math.random() * 0.5);
      console.log(`Retrying in ${Math.round(delay)}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError || new Error('Operation failed after retries');
};

// Helper to check if a collection exists
const checkCollection = async (collectionName: string) => {
  const db = await getDb();
  try {
    const colRef = collection(db, collectionName);
    return true;
  } catch (error) {
    console.error(`Error checking collection ${collectionName}:`, error);
    return false;
  }
};

// Initialize required collections
const initializeCollections = async () => {
  console.log('Initializing Firebase collections...');
  
  try {
    // Check and initialize challenges collection
    const hasExistingChallenges = await checkCollection('challenges');
    if (!hasExistingChallenges) {
      console.log('Initializing challenges collection...');
      const { initializeChallenges } = await import('./ai-challenges');
      await initializeChallenges();
    }
    
    console.log('Firebase collections initialized successfully');
  } catch (error) {
    console.error('Failed to initialize collections:', error);
    await showError(
      'Database Initialization Error',
      'Failed to initialize the database collections. Please refresh the page or contact support if the problem persists.'
    );
  }
};

// Export all necessary Firebase instances and utilities
export {
  app as default,
  auth,
  storage,
  analytics,
  withRetry,
  getCollectionRefs as collections,
  checkCollection,
  initializeCollections,
  serverTimestamp,
  getDb as db
};
