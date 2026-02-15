import { doc, deleteDoc, setDoc } from 'firebase/firestore';
import { db } from '@/features/core/firebase/firestore/firestore.client';

/**
 * Adds a bookmark for a user.
 * @param userId The ID of the user.
 * @param logId The ID of the log to bookmark.
 */
export const addBookmark = async (userId: string, logId: string): Promise<void> => {
  const bookmarkRef = doc(db, `users/${userId}/bookmarks`, logId);
  await setDoc(bookmarkRef, { bookmarkedAt: new Date() });
};

/**
 * Removes a bookmark for a user.
 * @param userId The ID of the user.
 * @param logId The ID of the log to unbookmark.
 */
export const removeBookmark = async (userId: string, logId: string): Promise<void> => {
  const bookmarkRef = doc(db, `users/${userId}/bookmarks`, logId);
  await deleteDoc(bookmarkRef);
};
