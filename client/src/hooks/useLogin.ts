import { ChangeEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import auth from '../config/firebase';
import useLoginContext from './useLoginContext';

/**
 * Custom hook to handle login and registration with Firebase Authentication.
 *
 * @returns Object containing login state and handlers
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

  /**
   * Handles email input changes
   */
  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setError('');
  };

  /**
   * Handles password input changes
   */
  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setError('');
  };

  /**
   * Handles username input changes
   */
  const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
    setError('');
  };

  /**
   * Toggles between login and registration modes
   */
  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
  };

  /**
   * Handles form submission for both login and registration
   */
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        // Handle login
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        setUser({ username: email.split('@')[0] }); // Temporary username from email
        navigate('/home');
      } else {
        // Handle registration
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);

        // Get Firebase token
        const token = await userCredential.user.getIdToken();

        // Create user profile in your backend
        const response = await fetch('http://localhost:8000/auth/profile', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ username }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText);
        }

        const userData = await response.json();
        setUser({ username: userData.username });
        navigate('/home');
      }
    } catch (err) {
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
