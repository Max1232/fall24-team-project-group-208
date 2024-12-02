import React from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  CircularProgress,
  TextField,
  IconButton,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LogoutIcon from '@mui/icons-material/Logout';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import useHeader from '../../hooks/useHeader';

/**
 * Header component that renders the main title, search bar, and authentication status.
 * The search bar allows the user to input a query and navigate to the search results page
 * when they press Enter.
 * @param {Function} toggleTheme - Function to toggle the theme between light and dark mode.
 * @param {Boolean} isDarkMode - Boolean value to determine if the theme is in dark mode.
 * @param {Number} sidebarWidth - Number value to determine the width of the sidebar.
 */
interface HeaderProps {
  toggleTheme: () => void;
  isDarkMode: boolean;
  sidebarWidth: number;
}

const Header: React.FC<HeaderProps> = ({ toggleTheme, isDarkMode, sidebarWidth }) => {
  const { val, handleInputChange, handleKeyDown, user, handleSignOut, loading } = useHeader();

  return (
    <AppBar
      position='fixed'
      elevation={0}
      sx={{
        backgroundColor: 'background.default',
        width: `calc(100% - ${sidebarWidth}px)`,
        transition: 'width 0.5s ease',
      }}>
      <Toolbar>
        <TextField
          id='searchBar'
          placeholder='Search ...'
          type='text'
          value={val}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          variant='outlined'
          size='small'
          sx={{
            'mr': 2,
            'backgroundColor': 'background.default',
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'primary.main',
              },
              '&:hover fieldset': {
                borderColor: 'primary.main',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'primary.main',
              },
            },
          }}
          slots={{
            startAdornment: (
              <IconButton>
                <SearchIcon color='primary' />
              </IconButton>
            ),
          }}
        />
        <Typography variant='h6' sx={{ flexGrow: 1, textAlign: 'center' }}></Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={toggleTheme} color='primary'>
            {isDarkMode ? (
              <Brightness7Icon sx={{ fontSize: 30 }} />
            ) : (
              <Brightness4Icon sx={{ fontSize: 30 }} />
            )}
          </IconButton>{' '}
          {loading && <CircularProgress size={24} sx={{ ml: 2 }} />}
          {!loading && user && (
            <Button onClick={handleSignOut} variant='contained' color='primary' sx={{ ml: 2 }}>
              <LogoutIcon />
              Logout
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
