import { useState, useEffect } from 'react';
import { getDocs, onSnapshot, query, QueryConstraint, DocumentData } from 'firebase/firestore';
import { collections, withRetry } from '../lib/firebase';

interface FirestoreState<T> {
  data: T[];
  loading: boolean;
  error: Error | null;
}

export function useFirestore<T extends DocumentData>(
  collectionName: keyof typeof collections,
  queryConstraints: QueryConstraint[] = []
) {
  const [state, setState] = useState<FirestoreState<T>>({
    data: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    const collectionRef = collections[collectionName];
    if (!collectionRef) {
      setState({
        data: [],
        loading: false,
        error: new Error(`Collection ${collectionName} not found`),
      });
      return;
    }

    let unsubscribe: (() => void) | undefined;

    // Set up real-time listener with retry mechanism
    withRetry(
      () =>
        onSnapshot(
          query(collectionRef, ...queryConstraints),
          (snapshot) => {
            const data = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            })) as T[];

            setState({
              data,
              loading: false,
              error: null,
            });
          },
          (error) => {
            console.error(`Firestore subscription error for ${collectionName}:`, error);
            setState((prev) => ({
              ...prev,
              loading: false,
              error: error as Error,
            }));
          }
        ),
      3, // maxRetries
      1000, // baseDelay
      (attempt, error) => {
        console.warn(
          `Retrying Firestore subscription for ${collectionName} (attempt ${attempt}):`,
          error
        );
      }
    )
    .then((unsub) => {
      unsubscribe = unsub;
    })
    .catch((error) => {
      console.error(`Failed to set up Firestore subscription for ${collectionName}:`, error);
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error as Error,
      }));
    });

    // Cleanup subscription
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [collectionName, ...queryConstraints]);

  return state;
}
