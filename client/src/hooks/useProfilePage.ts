import { useState, useEffect, useCallback } from 'react';
import useUserContext from './useUserContext';
import { User } from '../types';

interface ProfileHookReturn {
  profileData: User | null;
  loading: boolean;
  error: string | null;
  refreshProfile: () => Promise<void>;
}

const useProfilePage = (): ProfileHookReturn => {
  const { user } = useUserContext();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<User | null>(() => {
    const savedProfile = localStorage.getItem(`profile_${user.username}`);
    if (!savedProfile) return null;

    try {
      const parsed = JSON.parse(savedProfile);
      return {
        ...parsed,
        joinedDate: parsed.joinedDate ? new Date(parsed.joinedDate) : new Date(),
      };
    } catch {
      return null;
    }
  });

  const fetchProfileData = useCallback(async (): Promise<void> => {
    if (!user?.username) {
      setLoading(false);
      setError('No user logged in');
      return;
    }

    try {
      const serverURL = process.env.REACT_APP_SERVER_URL;
      if (!serverURL) {
        setError('Server URL not configured');
        return;
      }

      const response = await fetch(`${serverURL}/users/${user.username}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      let data: User;

      if (response.status === 404) {
        data = {
          username: user.username,
          uid: user.uid,
          reputation: 0,
          level: 1,
          levelThreshold: 40,
          levelProgress: 0,
          answers: 0,
          questions: 0,
          acceptedAnswers: 0,
          comments: 0,
          badges: [],
          joinedDate: new Date(),
          role: 1,
        };
      } else if (!response.ok) {
        setError(`Server responded with status: ${response.status}`);
        return;
      } else {
        const rawData = await response.json();
        data = {
          ...rawData,
          joinedDate: new Date(rawData.joinedDate),
        };
      }

      try {
        localStorage.setItem(`profile_${user.username}`, JSON.stringify(data));
      } catch {
        // Silently handle storage errors
      }

      setProfileData(data);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(`Failed to fetch profile: ${errorMessage}`);

      const cachedProfile = localStorage.getItem(`profile_${user.username}`);
      if (cachedProfile) {
        try {
          const parsed = JSON.parse(cachedProfile);
          setProfileData({
            ...parsed,
            joinedDate: new Date(parsed.joinedDate),
          });
        } catch {
          // Silently handle parse errors
        }
      }
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchProfileData().then(() => {});
  }, [fetchProfileData]);

  const refreshProfile = useCallback(async (): Promise<void> => {
    setLoading(true);
    try {
      localStorage.removeItem(`profile_${user.username}`);
    } catch {
      // Silently handle storage errors
    }
    await fetchProfileData();
  }, [user.username, fetchProfileData]);

  return { profileData, loading, error, refreshProfile };
};

export default useProfilePage;
