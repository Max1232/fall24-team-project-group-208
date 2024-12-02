import { useContext, useEffect } from 'react';
import UserContext, {
  UserContextType,
  getStoredUser,
  setStoredUser,
} from '../contexts/UserContext';
import { WINDOW_ID } from '../config/firebase';
import AuthService from '../services/authService';

/**
 * Custom hook to manage the user context.
 * It restores the user from session storage if missing and ensures the correct window session.
 *
 * @returns {UserContextType} The user context.
 * @throws {Error} If the user context is null.
 */
const useUserContext = (): UserContextType => {
  const context = useContext(UserContext);

  useEffect(() => {
    // If context exists but user is missing, try to restore from session storage
    if (context && !context.user) {
      const storedUser = getStoredUser();
      if (storedUser) {
        context.user = storedUser;
      }
    }

    // Check if this is the correct window session
    const storedWindowId = sessionStorage.getItem('auth_window_id');
    if (storedWindowId && storedWindowId !== WINDOW_ID) {
      // Wrong window, clear context
      AuthService.clearAuth(WINDOW_ID);
      if (context) {
        context.user = null!;
      }
    }
  }, [context]);

  useEffect(() => {
    // Store user data whenever it changes
    if (context?.user) {
      setStoredUser(context.user);
    }
  }, [context?.user]);

  if (context === null) {
    throw new Error('User context is null.');
  }

  // Always try to get fresh user data from storage first
  const storedUser = getStoredUser();
  if (storedUser && (!context.user || context.user.username !== storedUser.username)) {
    // Only update if it's for the correct window
    const storedWindowId = sessionStorage.getItem('auth_window_id');
    if (storedWindowId === WINDOW_ID) {
      context.user = storedUser;
    }
  }

  return context;
};

export default useUserContext;