import React, { memo } from 'react';
import {
  Box,
  CircularProgress,
  Typography,
  Card,
  CardContent,
  Avatar,
  LinearProgress,
  Alert,
} from '@mui/material';
import useProfilePage from '../../hooks/useProfilePage';

const ProfilePage: React.FC = () => {
  const { profileData, loading, error } = useProfilePage();

  if (loading) {
    return (
      <Box display='flex' justifyContent='center' alignItems='center' minHeight='100vh'>
        <CircularProgress size={40} thickness={4} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display='flex' justifyContent='center' alignItems='center' minHeight='100vh' p={2}>
        <Alert severity='error' variant='filled' sx={{ maxWidth: 600 }}>
          {error}
        </Alert>
      </Box>
    );
  }

  if (!profileData) {
    return (
      <Box display='flex' justifyContent='center' alignItems='center' minHeight='100vh'>
        <Alert severity='info' variant='filled' sx={{ maxWidth: 600 }}>
          No profile data available. Please try refreshing the page.
        </Alert>
      </Box>
    );
  }

  return (
    <Box display='flex' flexDirection='column' alignItems='center' p={2} mt={10}>
      <Card sx={{ width: '100%', maxWidth: 600, mb: 2 }}>
        <CardContent>
          <Box display='flex' alignItems='center'>
            <Avatar sx={{ width: 56, height: 56, mr: 2 }}>
              {profileData.username.slice(0, 2).toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant='h3'>{profileData.username}</Typography>
              <Typography variant='body2' color='textSecondary'>
                Level {profileData.level || 1} • {profileData.reputation || 0} reputation points
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Card sx={{ width: '100%', maxWidth: 600, mb: 2 }}>
        <CardContent>
          <Typography variant='h3'>Badges</Typography>
          <Box display='flex' flexWrap='wrap' mt={1} gap={1}>
            {profileData.badges?.length ? (
              profileData.badges.map((badge, index) => (
                <Box
                  key={index}
                  bgcolor='primary.main'
                  color='primary.contrastText'
                  p={1}
                  borderRadius={1}>
                  {badge}
                </Box>
              ))
            ) : (
              <Typography color='textSecondary'>No badges earned yet</Typography>
            )}
          </Box>
        </CardContent>
      </Card>

      <Card sx={{ width: '100%', maxWidth: 600, mb: 2 }}>
        <CardContent>
          <Typography variant='h3'>Reputation</Typography>
          <Typography variant='body1'>{profileData.reputation || 0} reputation points</Typography>
        </CardContent>
      </Card>

      <Box sx={{ width: '100%', maxWidth: 600 }}>
        <Typography variant='h4' gutterBottom>
          Progress to Level {(profileData.level || 1) + 1}
        </Typography>
        <LinearProgress
          variant='determinate'
          value={(profileData.reputation || 0) % 100}
          sx={{ height: 40, borderRadius: 10 }}
        />
      </Box>
    </Box>
  );
};

export default memo(ProfilePage);
