
'use client';

import { useState, useEffect, useCallback } from 'react';

import { onSnapshot, doc } from 'firebase/firestore';

import { useAuth } from '@/context/auth-context';
import { useFirebase } from '@/context/firebase-context';
import {
  updateUserProfile,
  getUserProfile,
} from '@/features/account/services/account.service';
import { uploadProfilePicture } from '@/features/core/firebase/storage/storage.facade';
import type { UserProfile } from '@/types/domain';

/**
 * @fileoverview A hook for managing the current user's profile data.
 * This hook acts as the designated bridge between UI components and the
 * underlying infrastructure for user profile management.
 */
export function useUser() {
  const { state: authState } = useAuth();
  const { user } = authState;
  const { db } = useFirebase();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !db) {
      // Only update state if it has changed to avoid unnecessary re-renders.
      if (profile !== null) setProfile(null);
      if (loading) setLoading(false);
      return;
    }

    // Set up a real-time listener for the user's profile document.
    if (!loading) setLoading(true);
    const unsub = onSnapshot(doc(db, 'users', user.id), (doc) => {
      if (doc.exists()) {
        setProfile({ id: doc.id, ...doc.data() } as UserProfile);
      } else {
        // If profile doesn't exist, create a default one.
        getUserProfile(user.id).then(setProfile);
      }
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsub();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, db]);

  const updateProfile = useCallback(
    async (data: Partial<Omit<UserProfile, 'id'>>) => {
      if (!user) throw new Error('User not authenticated.');
      await updateUserProfile(user.id, data);
    },
    [user]
  );

  const uploadAvatar = useCallback(
    async (file: File) => {
      if (!user) throw new Error('User not authenticated.');
      const photoURL = await uploadProfilePicture(user.id, file);
      await updateProfile({ photoURL });
      return photoURL;
    },
    [user, updateProfile]
  );

  return { profile, loading, updateProfile, uploadAvatar };
}
