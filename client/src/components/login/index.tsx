import React, { useEffect } from 'react';
import { TextField, Button, Typography, Container, Paper, Box } from '@mui/material';
import useLogin from '../../hooks/useLogin';
import Blobs from './blobs';

const Login: React.FC = () => {
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

  useEffect(() => {
    // Disable scrolling
    document.body.style.overflow = 'hidden';

    // Re-enable scrolling when the component is unmounted
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <Container component='main' maxWidth='xs' style={{ position: 'relative', minHeight: '100vh' }}>
      <Blobs />
      <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
        <Box display='flex' flexDirection='column' alignItems='center' mb={2}>
          <Box display='flex' alignItems='center' mb={0}>
            <img
              src='/devask-logo_pink-circle.png'
              alt='DevAsk Logo'
              style={{ marginRight: '10px', height: '100px' }}
            />
            <Typography component='h1' variant='h1' color='primary.main'>
              DevAsk
            </Typography>
          </Box>
          <Typography
            component='h2'
            variant='body1'
            color='primary.main'
            sx={{ fontSize: '1.5rem' }}>
            Community by devs for devs.
          </Typography>
        </Box>

        <Typography component='h1' variant='h5'>
          {isLogin ? 'Sign In' : 'Create Account'}
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            variant='outlined'
            margin='normal'
            required
            fullWidth
            id='email'
            label='Email Address'
            name='email'
            autoComplete='email'
            autoFocus
            value={email}
            onChange={handleEmailChange}
          />
          {!isLogin && (
            <TextField
              variant='outlined'
              margin='normal'
              required
              fullWidth
              id='username'
              label='Username'
              name='username'
              autoComplete='username'
              value={username}
              onChange={handleUsernameChange}
            />
          )}
          <TextField
            variant='outlined'
            margin='normal'
            required
            fullWidth
            name='password'
            label='Password'
            type='password'
            id='password'
            autoComplete='current-password'
            value={password}
            onChange={handlePasswordChange}
          />
          {error && <Typography color='error'>{error}</Typography>}
          <Button
            type='submit'
            fullWidth
            variant='contained'
            color='primary'
            disabled={loading}
            style={{ margin: '24px 0 16px' }}>
            {buttonText}
          </Button>
          <Button onClick={toggleMode} fullWidth>
            {isLogin ? 'Create an account' : 'Sign in with existing account'}
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default Login;
