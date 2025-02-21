import { useState, useEffect } from 'react';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  DocumentData,
  QueryConstraint
} from 'firebase/firestore';
import { db } from '../lib/firebase';

export function useFirestore<T extends DocumentData>(
  collectionName: string,
  constraints?: QueryConstraint[]
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const q = constraints
          ? query(collection(db, collectionName), ...constraints)
          : collection(db, collectionName);
        
        const querySnapshot = await getDocs(q);
        const documents = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as T[];
        
        setData(documents);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An error occurred'));
        setLoading(false);
      }
    };

    fetchData();
  }, [collectionName, constraints]);

  const add = async (data: Omit<T, 'id'>) => {
    try {
      const docRef = await addDoc(collection(db, collectionName), {
        ...data,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      return docRef.id;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to add document');
    }
  };

  const update = async (id: string, data: Partial<T>) => {
    try {
      const docRef = doc(db, collectionName, id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: new Date()
      });
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to update document');
    }
  };

  const getById = async (id: string): Promise<T> => {
    try {
      const docRef = doc(db, collectionName, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as T;
      } else {
        throw new Error('Document not found');
      }
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to get document');
    }
  };

  return {
    data,
    loading,
    error,
    add,
    update,
    getById
  };
}