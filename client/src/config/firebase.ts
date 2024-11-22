/* eslint-disable no-console */
import { initializeApp } from 'firebase/app';
import { setPersistence, browserSessionPersistence } from 'firebase/auth';
import AuthService from '../services/authService';

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

// Generate a unique window ID
const WINDOW_ID = crypto.randomUUID();

// Get auth instance for this specific window
const auth = AuthService.getAuth(app, WINDOW_ID);

// Set persistence to SESSION instead of LOCAL
setPersistence(auth, browserSessionPersistence).catch(error => {
  throw new Error(`Error setting persistence: ${error}`);
});

export { WINDOW_ID };
export default auth;
