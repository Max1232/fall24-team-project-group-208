import { initializeApp } from 'firebase/app';
import AuthService from '../services/authService';

/**
 * Firebase configuration object.
 * Uses a unique window ID to store user data in session storage, so that
 * multiple windows can be open simultaneously without interfering with each other.
 * */
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get or generate window ID
export const WINDOW_ID = (() => {
  const stored = sessionStorage.getItem('current_window_id');
  if (stored) return stored;

  const newId = crypto.randomUUID();
  sessionStorage.setItem('current_window_id', newId);
  return newId;
})();

// Get auth instance synchronously
const auth = AuthService.getAuth(app, WINDOW_ID);

export default auth;
