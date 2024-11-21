/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import Layout from './layout';
import Login from './login';
import { FakeSOSocket, User } from '../types';
import LoginContext from '../contexts/LoginContext';
import UserContext from '../contexts/UserContext';
import QuestionPage from './main/questionPage';
import TagPage from './main/tagPage';
import NewQuestionPage from './main/newQuestion';
import NewAnswerPage from './main/newAnswer';
import AnswerPage from './main/answerPage';
import auth from '../config/firebase';
import ProtectedRoute from './auth/ProtectedRoute';
import ProfilePage from './profilePage';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { lightTheme, darkTheme } from '../theme';
import QuizPage from './main/quizPage';

/**
 * Represents the main component of the application.
 * It manages the state for search terms and the main title.
 */
const FakeStackOverflow = ({ socket }: { socket: FakeSOSocket | null }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, firebaseUser => {
      if (firebaseUser) {
        setUser({
          username: firebaseUser.email || 'Anonymous',
        });
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <LoginContext.Provider value={{ setUser }}>
        <UserContext.Provider value={{ user: user!, socket: socket! }}>
          <Routes>
            {/* Public Route */}
            <Route path='/' element={<Login />} />

            {/* Protected Routes */}
            <Route
              element={
                <ProtectedRoute>
                  <Layout toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
                </ProtectedRoute>
              }
            >
              <Route path='/login' element={<Login />} />
              <Route path='/home' element={<QuestionPage />} />
              <Route path='tags' element={<TagPage />} />
              <Route path='/question/:qid' element={<AnswerPage />} />
              <Route path='/new/question' element={<NewQuestionPage />} />
              <Route path='/new/answer/:qid' element={<NewAnswerPage />} />
              <Route path='/profile' element={<ProfilePage />} />
              <Route path='/quizzes' element={<QuizPage />} />
            </Route>

            {/* Catch-all route */}
            <Route path='*' element={<Navigate to='/' replace />} />
          </Routes>
        </UserContext.Provider>
      </LoginContext.Provider>
    </ThemeProvider>
  );
};

export default FakeStackOverflow;
