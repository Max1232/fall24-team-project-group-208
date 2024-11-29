import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { ThemeProvider, CssBaseline } from '@mui/material';
import Layout from './layout';
import Login from './login';
import { FakeSOSocket, User } from '../types';
import LoginContext from '../contexts/LoginContext';
import UserContext, { getStoredUser } from '../contexts/UserContext';
import QuestionPage from './main/questionPage';
import TagPage from './main/tagPage';
import AnswerPage from './main/answerPage';
import QuizQuestionPage from './main/quizQuestionPage';
import auth, { WINDOW_ID } from '../config/firebase';
import ProtectedRoute from './auth/ProtectedRoute';
import ProfilePage from './profilePage';
import { lightTheme, darkTheme } from '../theme';
import QuizPage from './main/quizPage';
import AuthService from '../services/authService';

const FakeStackOverflow = ({ socket }: { socket: FakeSOSocket | null }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if this window should have an active session
    const storedWindowId = sessionStorage.getItem('auth_window_id');

    if (storedWindowId && storedWindowId !== WINDOW_ID) {
      // This is a different window, clear the auth state
      AuthService.clearAuth(WINDOW_ID);
      setUser(null);
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(
      auth,
      firebaseUser => {
        if (firebaseUser) {
          // Only set user if this window owns the session
          if (!storedWindowId || storedWindowId === WINDOW_ID) {
            const storedData = sessionStorage.getItem(`user_data_${WINDOW_ID}`);
            const existingData = storedData ? JSON.parse(storedData) : getStoredUser();

            const userData: User = {
              username: firebaseUser.email || 'Anonymous',
              uid: firebaseUser.uid,
              ...existingData,
              reputation: existingData?.reputation ?? 0,
              level: existingData?.level ?? 1,
              levelThreshold: existingData?.levelThreshold ?? 40,
              levelProgress: existingData?.levelProgress ?? 0,
              answers: existingData?.answers ?? 0,
              questions: existingData?.questions ?? 0,
              acceptedAnswers: existingData?.acceptedAnswers ?? 0,
              comments: existingData?.comments ?? 0,
              badges: existingData?.badges ?? [],
              joinedDate: existingData?.joinedDate ? new Date(existingData.joinedDate) : new Date(),
            };

            setUser(userData);
            // Store data in session storage with window ID
            sessionStorage.setItem(`user_data_${WINDOW_ID}`, JSON.stringify(userData));
            sessionStorage.setItem('auth_window_id', WINDOW_ID);
          }
        } else {
          setUser(null);
          // Clean up session data
          sessionStorage.removeItem(`user_data_${WINDOW_ID}`);
          sessionStorage.removeItem('auth_window_id');
          AuthService.clearAuth(WINDOW_ID);
        }
        setLoading(false);
      },
      error => {
        setLoading(false);
        setUser(null);
      },
    );

    // eslint-disable-next-line consistent-return
    return () => {
      unsubscribe();
      if (socket) {
        socket.disconnect();
      }
    };
  }, [socket]);

  const handleSetUser = (newUser: User | null) => {
    setUser(newUser);
    if (newUser) {
      // Store in session storage with window ID
      sessionStorage.setItem(`user_data_${WINDOW_ID}`, JSON.stringify(newUser));
      sessionStorage.setItem('auth_window_id', WINDOW_ID);
    } else {
      // Clean up session data
      sessionStorage.removeItem(`user_data_${WINDOW_ID}`);
      sessionStorage.removeItem('auth_window_id');
      AuthService.clearAuth(WINDOW_ID);
    }
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-center'>
          <h2>Loading...</h2>
        </div>
      </div>
    );
  }

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <LoginContext.Provider value={{ setUser: handleSetUser }}>
        <Routes>
          {/* Public Route with redirect logic */}
          <Route path='/' element={user ? <Navigate to='/home' replace /> : <Login />} />

          {/* Protected Routes with proper user context */}
          <Route
            element={
              user && socket ? (
                <UserContext.Provider value={{ user, socket }}>
                  <ProtectedRoute>
                    <Layout toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
                  </ProtectedRoute>
                </UserContext.Provider>
              ) : (
                <Navigate to='/' replace />
              )
            }>
            <Route path='/login' element={<Login />} />
            <Route path='/home' element={<QuestionPage />} />
            <Route path='tags' element={<TagPage />} />
            <Route path='/question/:qid' element={<AnswerPage />} />
            <Route path='/quiz/:qid' element={<QuizQuestionPage />} />
            <Route path='/profile' element={<ProfilePage />} />
            <Route path='/quizzes' element={<QuizPage />} />
          </Route>

          {/* Catch-all route */}
          <Route path='*' element={<Navigate to='/' replace />} />
        </Routes>
      </LoginContext.Provider>
    </ThemeProvider>
  );
};

export default FakeStackOverflow;
