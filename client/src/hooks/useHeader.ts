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
      // Get the value directly from state instead of event
      const searchTerm = val.trim();

      if (searchTerm) {
        const searchParams = new URLSearchParams();
        searchParams.set('search', searchTerm);
        navigate(`/home?${searchParams.toString()}`);
      } else {
        navigate('/home');
      }

      // Clear the search input
      setVal('');
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/', { replace: true });
    } catch (error) {
      throw new Error(`Error signing out: ${error}`);
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