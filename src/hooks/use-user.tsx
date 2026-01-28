'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import type { UserProfile } from '@/lib/types';

interface UseUserReturn {
    user: User | null;
    profile: UserProfile | null;
    loading: boolean;
}

export function useUser(): UseUserReturn {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (userAuth) => {
      if (userAuth) {
        setUser(userAuth);
        try {
            const userRef = doc(db, 'users', userAuth.uid);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
              setProfile(userSnap.data() as UserProfile);
            } else {
              setProfile(null);
            }
        } catch (error) {
            console.error("Error fetching user profile:", error);
            setProfile(null);
        }
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { user, profile, loading };
}
