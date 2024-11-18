import React from 'react';
import './index.css';
import useLogin from '../../hooks/useLogin';

const Login = () => {
  const {
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
  } = useLogin();

  let buttonText;
  if (loading) {
    buttonText = 'Processing...';
  } else if (isLogin) {
    buttonText = 'Sign In';
  } else {
    buttonText = 'Create Account';
  }

  return (
    <div className='container'>
      <h2>Welcome to FakeStackOverflow!</h2>
      <h4>{isLogin ? 'Please sign in.' : 'Create your account.'}</h4>

      <form onSubmit={handleSubmit}>
        {error && <div className='error-message'>{error}</div>}

        <input
          type='email'
          value={email}
          onChange={handleEmailChange}
          placeholder='Enter your email'
          required
          className='input-text'
        />

        {!isLogin && (
          <input
            type='text'
            value={username}
            onChange={handleUsernameChange}
            placeholder='Choose a username'
            required
            className='input-text'
          />
        )}

        <input
          type='password'
          value={password}
          onChange={handlePasswordChange}
          placeholder='Enter your password'
          required
          className='input-text'
        />
        <button type='submit' className='login-button' disabled={loading}>
          {/* eslint-disable-next-line no-nested-ternary */}
          {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Create Account'}

        </button>

        <button type='button' onClick={toggleMode} className='toggle-button'>
          {isLogin ? 'Need an account? Register' : 'Already have an account? Sign In'}
        </button>
      </form>
    </div>
  );
};

export default Login;
