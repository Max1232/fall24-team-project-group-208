import { Navigate } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import { Box, CircularProgress } from '@mui/material';
import auth from '../../config/firebase';
import UserContext from '../../contexts/UserContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const context = useContext(UserContext);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      // Check both Firebase auth and context
      setIsAuthenticated(!!user && !!context?.user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [context?.user]); // Add context.user as dependency

  // Show loading state while checking auth
  if (loading) {
    return (
      <Box display='flex' justifyContent='center' alignItems='center' minHeight='100vh'>
        <CircularProgress />
      </Box>
    );
  }

  // Redirect if not authenticated or missing context
  if (!isAuthenticated || !context?.user) {
    return <Navigate to='/' replace />;
  }

  // User is authenticated and has context
  return <>{children}</>;
};

export default ProtectedRoute;
