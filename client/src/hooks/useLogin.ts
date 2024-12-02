import React, { ChangeEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  setPersistence,
  browserSessionPersistence,
} from 'firebase/auth';
import auth, { WINDOW_ID } from '../config/firebase';
import useLoginContext from './useLoginContext';
import AuthService from '../services/authService';

/**
 * Custom hook to handle login and registration with Firebase Authentication.
 */
const useLogin = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const { setUser } = useLoginContext();
  const navigate = useNavigate();

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setError('');
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setError('');
  };

  const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
    setError('');
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Set session persistence before authentication
      await setPersistence(auth, browserSessionPersistence);

      if (isLogin) {
        // Handle login
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const token = await userCredential.user.getIdToken();

        // Store the window ID in session storage
        sessionStorage.setItem('auth_window_id', WINDOW_ID);

        // Fetch user profile
        const response = await fetch(
          `${process.env.REACT_APP_SERVER_URL}/auth/profile/${email.split('@')[0]}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!response.ok) {
          const errorText = await response.text();
          setError(errorText);
        }

        const userData = await response.json();
        setUser(userData);

        // Store user data with window ID
        sessionStorage.setItem(`user_data_${WINDOW_ID}`, JSON.stringify(userData));

        navigate('/home');
      } else {
        // Handle registration
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const token = await userCredential.user.getIdToken();

        // Store the window ID in session storage
        sessionStorage.setItem('auth_window_id', WINDOW_ID);

        // Create user profile
        const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/auth/profile`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ username }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          setError(errorText);
        }

        const userData = await response.json();
        setUser(userData);

        // Store user data with window ID
        sessionStorage.setItem(`user_data_${WINDOW_ID}`, JSON.stringify(userData));

        navigate('/home');
      }
    } catch (err) {
      // Clean up any partial authentication state on error
      AuthService.clearAuth(WINDOW_ID);
      sessionStorage.removeItem('auth_window_id');
      sessionStorage.removeItem(`user_data_${WINDOW_ID}`);

      let errorMessage = 'An error occurred';
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    password,
    username,
    isLogin,
    error,
    loading,
    handleEmailChange,
    handlePasswordChange,
    handleUsernameChange,
    handleSubmit,
    toggleMode,
  };
};

export default useLogin;
