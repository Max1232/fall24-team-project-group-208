import { useState, useEffect } from 'react';
import useUserContext from './useUserContext';
import { User } from '../types';

export const useProfilePage = () => {
  const { user } = useUserContext();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<User | null>(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const serverURL = process.env.REACT_APP_SERVER_URL;
        if (!serverURL) {
          setError('Server URL not configured');
          setLoading(false);
          return;
        }

        const response = await fetch(`${serverURL}/users/${user.username}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // Important for cookies/session
        });

        if (!response.ok) {
          if (response.status === 404) {
            // If user doesn't exist in database yet, use default values
            setProfileData({
              username: user.username,
              reputation: 0,
              level: 1,
              levelThreshold: 100,
              levelProgress: 0,
              answers: 0,
              questions: 0,
              acceptedAnswers: 0,
              comments: 0,
              badges: [],
              joinedDate: new Date(),
            });
            return;
          }
          setError(`HTTP error! status: ${response.status}`);
          setLoading(false);
          return;
        }

        const data = await response.json();
        setProfileData({
          ...data,
          joinedDate: data.joinedDate ? new Date(data.joinedDate) : new Date(),
        });
      } catch (err) {
        setError(`Error fetching profile: ${(err as Error).message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [user]);

  return { profileData, loading, error };
};

export default useProfilePage;
