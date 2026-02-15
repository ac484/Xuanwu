import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/features/core/firebase/firestore/firestore.client';
import type { User } from '@/types/domain';

/**
 * Retrieves a user profile from Firestore.
 * @param userId The ID of the user to retrieve.
 * @returns The user data or null if not found.
 */
export const getUserProfile = async (userId: string): Promise<User | null> => {
  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);
  return userSnap.exists() ? (userSnap.data() as User) : null;
};

/**
 * Updates a user profile in Firestore.
 * @param userId The ID of the user to update.
 * @param userData The data to update.
 */
export const updateUserProfile = async (
  userId: string,
  userData: Partial<User>
): Promise<void> => {
  const userRef = doc(db, 'users', userId);
  await setDoc(userRef, userData, { merge: true });
};
