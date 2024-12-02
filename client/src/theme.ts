import { createTheme } from '@mui/material/styles';
import { ThemeOptions } from '@mui/material/styles/createTheme';

/**
 * Common typography settings for both light and dark themes.
 * @type {ThemeOptions}
 */
const commonSettings: ThemeOptions = {
  typography: {
    h1: {
      fontFamily: 'Gurajada, sans-serif',
    },
    h2: {
      fontFamily: 'Gurajada, sans-serif',
    },
    h3: {
      fontFamily: 'Gurajada, sans-serif',
    },
    h4: {
      fontFamily: 'Gurajada, sans-serif',
    },
    h5: {
      fontFamily: 'Gurajada, sans-serif',
    },
    h6: {
      fontFamily: 'Gurajada, sans-serif',
    },
    body1: {
      fontFamily: 'Helvetica Neue, sans-serif',
    },
    body2: {
      fontFamily: 'Helvetica Neue, sans-serif',
    },
  },
};

/**
 * Light theme configuration.
 * @type {Theme}
 */
const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#ef5b5b',
      light: '#000',
    },
    secondary: {
      main: '#000000',
      light: '#ef5b5b',
    },
    background: {
      default: '#ffffff',
    },
  },
  ...commonSettings,
});

/**
 * Dark theme configuration.
 * @type {Theme}
 */
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#ef5b5b',
      light: '#ef5b5b',
    },
    secondary: {
      main: '#ffffff',
      light: '#fff',
    },
    background: {
      default: '#000000',
    },
  },
  ...commonSettings,
});

export { lightTheme, darkTheme };
