import React from 'react';
import {
  Box,
  CircularProgress,
  Typography,
  Card,
  CardContent,
  Avatar,
  LinearProgress,
} from '@mui/material';
import { useProfilePage } from '../../hooks/useProfilePage';

/**
 * ProfilePage component that displays the user's profile information.
 * It shows a loading spinner while data is being fetched, an error message if there's an error,
 * and the profile data if available.
 *
 * @returns {React.JSX.Element} The rendered ProfilePage component.
 */
const ProfilePage: React.FC = (): React.JSX.Element => {
  const { profileData, loading, error } = useProfilePage();

  if (loading) {
    return (
      <Box display='flex' justifyContent='center' alignItems='center' minHeight='100vh'>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display='flex' justifyContent='center' alignItems='center' minHeight='100vh'>
        <Box bgcolor='error.main' color='error.contrastText' p={4} borderRadius={2}>
          {error}
        </Box>
      </Box>
    );
  }

  if (!profileData) {
    return (
      <Box display='flex' justifyContent='center' alignItems='center' minHeight='100vh'>
        <Typography color='textSecondary'>No profile data available</Typography>
      </Box>
    );
  }

  return (
    <Box display='flex' flexDirection='column' alignItems='center' p={2} mt={10}>
      <Card sx={{ width: '100%', maxWidth: 600, mb: 2 }}>
        <CardContent>
          <Box display='flex' alignItems='center'>
            <Avatar sx={{ width: 56, height: 56, mr: 2 }}>
              {profileData.username.charAt(0).toUpperCase()}
              {profileData.username.charAt(1).toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant='h3'>{profileData.username}</Typography>
              <Typography variant='body2' color='textSecondary'>
                Level {profileData.level ?? 1} • {profileData.reputation ?? 0} reputation points
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Card sx={{ width: '100%', maxWidth: 600, mb: 2 }}>
        <CardContent>
          <Typography variant='h3'>Badges</Typography>
          <Box display='flex' flexWrap='wrap' mt={1}>
            {profileData.badges?.map((badge, index) => (
              <Box
                key={index}
                bgcolor='primary.main'
                color='primary.contrastText'
                p={1}
                m={0.5}
                borderRadius={1}>
                {badge}
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>

      <Card sx={{ width: '100%', maxWidth: 600, mb: 2 }}>
        <CardContent>
          <Typography variant='h3'>Reputation</Typography>
          <Typography variant='body1'>{profileData.reputation ?? 0} reputation points</Typography>
        </CardContent>
      </Card>

      <Box sx={{ width: '100%', maxWidth: 600 }}>
        <Typography variant='h4'>Progress to Level {(profileData.level ?? 1) + 1}</Typography>
        <LinearProgress
          variant='determinate'
          value={(profileData.reputation ?? 0) % 100}
          sx={{ height: 40, borderRadius: 10 }}
        />
      </Box>
    </Box>
  );
};

export default ProfilePage;
