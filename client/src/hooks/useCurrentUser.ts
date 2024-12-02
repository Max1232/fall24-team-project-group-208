import { useState, useEffect } from 'react';
import { WINDOW_ID } from '../config/firebase';

/**
 * Custom hook to manage the current user state.
 * It retrieves the user data from sessionStorage and updates the state when the storage changes.
 *
 * @returns {Object} An object containing the current user data.
 */
const useCurrentUser = () => {
  const [currentUser, setCurrentUser] = useState(() => {
    const storedData = sessionStorage.getItem(`user_data_${WINDOW_ID}`);
    try {
      return storedData ? JSON.parse(storedData) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    /**
     * Handles the storage change event.
     * Updates the current user state based on the new sessionStorage data.
     */
    const handleStorageChange = () => {
      const storedData = sessionStorage.getItem(`user_data_${WINDOW_ID}`);
      if (storedData) {
        try {
          setCurrentUser(JSON.parse(storedData));
        } catch {
          setCurrentUser(null);
        }
      } else {
        setCurrentUser(null);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return { user: currentUser };
};

export default useCurrentUser;
