import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import Layout from './layout';
import Login from './login';
import { FakeSOSocket, User } from '../types';
import LoginContext from '../contexts/LoginContext';
import UserContext, { getStoredUser } from '../contexts/UserContext';
import QuestionPage from './main/questionPage';
import TagPage from './main/tagPage';
import NewQuestionPage from './main/newQuestion';
import NewAnswerPage from './main/newAnswer';
import AnswerPage from './main/answerPage';
import auth from '../config/firebase';
import ProtectedRoute from './auth/ProtectedRoute';
import ProfilePage from './header/profilePage';

const FakeStackOverflow = ({ socket }: { socket: FakeSOSocket | null }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      firebaseUser => {
        if (firebaseUser) {
          const existingData = getStoredUser();
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
          localStorage.setItem('fakestack_user', JSON.stringify(userData));
        } else {
          setUser(null);
          localStorage.removeItem('fakestack_user');
          const keys = Object.keys(localStorage);
          keys.forEach(key => {
            if (key.startsWith('profile_')) {
              localStorage.removeItem(key);
            }
          });
        }
        setLoading(false); // Set loading to false once auth state is determined
      },
      error => {
        console.error('Auth state change error:', error);
        setLoading(false);
        setUser(null);
      },
    );

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
      localStorage.setItem('fakestack_user', JSON.stringify(newUser));
    } else {
      localStorage.removeItem('fakestack_user');
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('profile_')) {
          localStorage.removeItem(key);
        }
      });
    }
  };

  // Show loading state while Firebase auth initializes
  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-center'>
          <h2>Loading...</h2>
        </div>
      </div>
    );
  }

  return (
    <LoginContext.Provider value={{ setUser: handleSetUser }}>
      <Routes>
        {/* If user is authenticated, redirect to home */}
        <Route path='/' element={user ? <Navigate to='/home' replace /> : <Login />} />
        <Route
          element={
            user && socket ? (
              <UserContext.Provider value={{ user, socket }}>
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              </UserContext.Provider>
            ) : (
              <Navigate to='/' replace />
            )
          }>
          <Route path='/home' element={<QuestionPage />} />
          <Route path='tags' element={<TagPage />} />
          <Route path='/question/:qid' element={<AnswerPage />} />
          <Route path='/new/question' element={<NewQuestionPage />} />
          <Route path='/new/answer/:qid' element={<NewAnswerPage />} />
          <Route path='profile' element={<ProfilePage />} />
        </Route>
        <Route path='*' element={<Navigate to='/' replace />} />
      </Routes>
    </LoginContext.Provider>
  );
};

export default FakeStackOverflow;
