import { useState, useEffect, useCallback } from 'react';
import useUserContext from './useUserContext';
import { User } from '../types';

export const useProfilePage = () => {
  const { user } = useUserContext();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<User | null>(() => {
    // Initialize from localStorage if available
    const savedProfile = localStorage.getItem(`profile_${user.username}`);
    if (savedProfile) {
      const parsed = JSON.parse(savedProfile);
      // Safely parse the date
      parsed.joinedDate = parsed.joinedDate ? new Date(parsed.joinedDate) : new Date();
      return parsed;
    }
    return null;
  });

  const fetchProfileData = useCallback(async () => {
    if (!user?.username) {
      setLoading(false);
      return;
    }

    try {
      const serverURL = process.env.REACT_APP_SERVER_URL;
      if (!serverURL) {
        throw new Error('Server URL not configured');
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
        // Default user data for new users
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
        };
      } else if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      } else {
        data = await response.json();
        // Safely parse the date
        data.joinedDate = data.joinedDate ? new Date(data.joinedDate) : new Date();
      }

      // Store in localStorage
      localStorage.setItem(`profile_${user.username}`, JSON.stringify(data));
      setProfileData(data);
    } catch (err) {
      setError(`Error fetching profile: ${(err as Error).message}`);
      // Try to use cached data if available
      const cachedProfile = localStorage.getItem(`profile_${user.username}`);
      if (cachedProfile) {
        const parsed = JSON.parse(cachedProfile);
        // Safely parse the date for cached data
        parsed.joinedDate = parsed.joinedDate ? new Date(parsed.joinedDate) : new Date();
        setProfileData(parsed);
      }
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchProfileData();
  }, [fetchProfileData]);

  const refreshProfile = async () => {
    setLoading(true);
    localStorage.removeItem(`profile_${user.username}`);
    await fetchProfileData();
  };

  return { profileData, loading, error, refreshProfile };
};

export default useProfilePage;
