/* eslint-disable no-console */
import { ChangeEvent, useState, KeyboardEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import auth from '../config/firebase';

const useHeader = () => {
  const navigate = useNavigate();
  const [val, setVal] = useState<string>('');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, currentUser => {
      setUser(currentUser);
      setLoading(false);

      // If not authenticated and not on the main page, redirect to main page
      if (!currentUser && window.location.pathname !== '/') {
        navigate('/');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setVal(e.target.value);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const searchParams = new URLSearchParams();
      searchParams.set('search', e.currentTarget.value);
      navigate(`/home?${searchParams.toString()}`);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      // Navigate to root path instead of /login
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return {
    val,
    setVal,
    handleInputChange,
    handleKeyDown,
    user,
    loading,
    handleSignOut,
  };
};

export default useHeader;
