import { createContext } from 'react';
import { FakeSOSocket, User } from '../types';
import { WINDOW_ID } from '../config/firebase';

export interface UserContextType {
  user: User;
  socket: FakeSOSocket;
}

export const getStoredUser = (): User | null => {
  // Get the window-specific user data
  const storedWindowId = sessionStorage.getItem('auth_window_id');
  if (!storedWindowId || storedWindowId !== WINDOW_ID) {
    return null;
  }

  const storedUser = sessionStorage.getItem(`user_data_${WINDOW_ID}`);
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

export const setStoredUser = (user: User | null) => {
  if (user) {
    sessionStorage.setItem(`user_data_${WINDOW_ID}`, JSON.stringify(user));
    sessionStorage.setItem('auth_window_id', WINDOW_ID);
  } else {
    sessionStorage.removeItem(`user_data_${WINDOW_ID}`);
    sessionStorage.removeItem('auth_window_id');
  }
};

const UserContext = createContext<UserContextType | null>(null);

export default UserContext;
