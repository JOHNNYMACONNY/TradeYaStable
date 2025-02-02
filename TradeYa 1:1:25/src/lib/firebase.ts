import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  connectFirestoreEmulator,
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
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
  serverTimestamp
} from 'firebase/firestore';
import { 
  getAuth, 
  connectAuthEmulator,
  Auth
} from 'firebase/auth';
import { getStorage, connectStorageEmulator } from 'firebase/storage';
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

// Initialize Firestore with multi-tab persistence
const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager()
  })
});

// Initialize Auth
const auth = getAuth(app);

// Initialize Storage
const storage = getStorage(app);

// Connect to emulators in development
if (process.env.NODE_ENV === 'development') {
  if (window.location.hostname === 'localhost') {
    try {
      connectFirestoreEmulator(db, 'localhost', 8080);
      connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
      connectStorageEmulator(storage, 'localhost', 9199);
      console.log('Connected to Firebase emulators');
    } catch (error) {
      console.error('Failed to connect to emulators:', error);
    }
  }
}

// Only initialize analytics in production
const analytics = typeof window !== 'undefined' && process.env.NODE_ENV === 'production' 
  ? getAnalytics(app)
  : null;

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

// Initialize collections
const collections = {
  challenges: collection(db, 'challenges'),
  users: collection(db, 'users'),
  trades: collection(db, 'trades'),
  conversations: collection(db, 'conversations'),
  messages: collection(db, 'messages'),
  collaborations: collection(db, 'collaborations')
};

// Helper to check if a collection exists
const checkCollection = async (collectionName: string) => {
  try {
    const snapshot = await getDocs(collection(db, collectionName));
    console.log(`Collection ${collectionName} exists with ${snapshot.size} documents`);
    return snapshot.size > 0;
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
  db,
  auth,
  storage,
  analytics,
  withRetry,
  collections,
  checkCollection,
  initializeCollections,
  serverTimestamp
};