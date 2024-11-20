import { useContext, useEffect } from 'react';
import UserContext, { UserContextType, getStoredUser } from '../contexts/UserContext';

const useUserContext = (): UserContextType => {
  const context = useContext(UserContext);

  useEffect(() => {
    // If context exists but user is missing, try to restore from localStorage
    if (context && !context.user) {
      const storedUser = getStoredUser();
      if (storedUser) {
        // You'll need to update your UserContext Provider to accept this
        context.user = storedUser;
      }
    }
  }, [context]);

  if (context === null) {
    throw new Error('User context is null.');
  }

  // Always try to get fresh user data from storage first
  const storedUser = getStoredUser();
  if (storedUser && (!context.user || context.user.username !== storedUser.username)) {
    context.user = storedUser;
  }

  return context;
};

export default useUserContext;
