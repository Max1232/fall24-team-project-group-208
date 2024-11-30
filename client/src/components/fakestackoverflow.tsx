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
  // Initialize from session storage immediately
  const [user, setUser] = useState<User | null>(() => {
    const storedData = sessionStorage.getItem(`user_data_${WINDOW_ID}`);
    try {
      return storedData ? JSON.parse(storedData) : null;
    } catch {
      return null;
    }
  });
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Quick check for active session
    const storedWindowId = sessionStorage.getItem('auth_window_id');
    const storedData = sessionStorage.getItem(`user_data_${WINDOW_ID}`);

    const unsubscribe = onAuthStateChanged(
      auth,
      firebaseUser => {
        if (firebaseUser) {
          if (!storedWindowId || storedWindowId === WINDOW_ID) {
            // Use existing data or create new user data
            const existingData = storedData ? JSON.parse(storedData) : null;

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
            sessionStorage.setItem(`user_data_${WINDOW_ID}`, JSON.stringify(userData));
            sessionStorage.setItem('auth_window_id', WINDOW_ID);
          }
        } else {
          setUser(null);
          sessionStorage.removeItem(`user_data_${WINDOW_ID}`);
          sessionStorage.removeItem('auth_window_id');
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
      sessionStorage.setItem(`user_data_${WINDOW_ID}`, JSON.stringify(newUser));
      sessionStorage.setItem('auth_window_id', WINDOW_ID);
    } else {
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
