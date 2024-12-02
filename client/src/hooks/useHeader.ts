import { ChangeEvent, useState, KeyboardEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import auth from '../config/firebase';

/**
 * Custom hook to manage the state and logic for the header component.
 * It handles user authentication state, input changes, and sign-out functionality.
 */
const useHeader = () => {
  const navigate = useNavigate();
  const [val, setVal] = useState<string>('');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    /**
     * Subscribe to authentication state changes.
     * Redirect to the home page if the user is not authenticated.
     */
    const unsubscribe = onAuthStateChanged(auth, currentUser => {
      setUser(currentUser);
      setLoading(false);

      if (!currentUser && window.location.pathname !== '/') {
        navigate('/');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  /**
   * Handle input change event.
   * @param e - The change event of the input element.
   */
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setVal(e.target.value);
  };

  /**
   * Handle key down event.
   * If the Enter key is pressed, navigate to the search results page.
   * @param e - The keyboard event of the input element.
   */
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

  /**
   * Handle user sign-out.
   * Sign out the user and navigate to the home page.
   */
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