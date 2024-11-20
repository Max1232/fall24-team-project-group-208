import { createContext } from 'react';
import { FakeSOSocket, User } from '../types';

export interface UserContextType {
  user: User;
  socket: FakeSOSocket;
}

// Create a function to get initial user data
export const getStoredUser = (): User | null => {
  const storedUser = localStorage.getItem('fakestack_user');
  if (storedUser) {
    const parsed = JSON.parse(storedUser);
    // Ensure date is properly parsed if it exists
    if (parsed.joinedDate) {
      parsed.joinedDate = new Date(parsed.joinedDate);
    }
    return parsed;
  }
  return null;
};

const UserContext = createContext<UserContextType | null>(null);

export default UserContext;
