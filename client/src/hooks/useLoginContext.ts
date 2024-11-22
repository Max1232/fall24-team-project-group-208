import { useContext } from 'react';
import LoginContext, { LoginContextType } from '../contexts/LoginContext';
import { WINDOW_ID } from '../config/firebase';
import AuthService from '../services/authService';

/**
 * Custom hook to access the LoginContext with window-specific session handling.
 *
 * @throws Will throw an error if the LoginContext is null.
 * @returns Modified context with window-specific session handling
 */
const useLoginContext = (): LoginContextType => {
  const context = useContext(LoginContext);

  if (context === null) {
    throw new Error('Login context is null.');
  }

  // Wrap the original setUser function to handle window-specific sessions
  const originalSetUser = context.setUser;
  context.setUser = userData => {
    if (userData) {
      // Store window-specific session data
      sessionStorage.setItem('auth_window_id', WINDOW_ID);
      sessionStorage.setItem(`user_data_${WINDOW_ID}`, JSON.stringify(userData));
    } else {
      // Clean up window-specific session data on logout
      AuthService.clearAuth(WINDOW_ID);
      sessionStorage.removeItem('auth_window_id');
      sessionStorage.removeItem(`user_data_${WINDOW_ID}`);
    }

    // Call original setUser function
    originalSetUser(userData);
  };

  return context;
};

export default useLoginContext;
