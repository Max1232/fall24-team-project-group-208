import React from 'react';
import { TextField, Button, Typography, Container, Paper } from '@mui/material';
import useLogin from '../../hooks/useLogin';
import Blobs from './blobs';

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
    <Container component="main" maxWidth="xs" style={{ position: 'relative', minHeight: '100vh' }}>
      <Blobs />
      <Paper elevation={3} style={{ padding: '20px', position: 'relative', zIndex: 2 }}>
        <Typography component="div" variant="h4" textAlign="center">
          <img src="/devask-logo_pink-circle.png" alt="Icon" style={{ width: '170px', height: '170px' }} />
        </Typography>
        <Typography component="h1" variant="h1" textAlign="center">
          DevAsk
        </Typography>
        <Typography component="h2" variant="subtitle1">
          {isLogin ? 'Please sign in.' : 'Create your account.'}
        </Typography>
        <form onSubmit={handleSubmit}>
          {error && <Typography color="error">{error}</Typography>}
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={handleEmailChange}
          />
          {!isLogin && (
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              value={username}
              onChange={handleUsernameChange}
            />
          )}
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={handlePasswordChange}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={loading}
            style={{ margin: '10px 0' }}
          >
            {buttonText}
          </Button>
          <Button
            fullWidth
            variant="text"
            color="secondary"
            onClick={toggleMode}
          >
            {isLogin ? 'Need an account? Register' : 'Already have an account? Sign In'}
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default Login;
