import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import SideBarNav from '../sideBarNav';
import Header from '../header';

/**
 * Main component represents the layout of the main page, including a sidebar and the main content area.
 * @param {Function} toggleTheme - Function to toggle the theme of the application.
 * @param {Boolean} isDarkMode - Boolean value to determine if the application is in dark mode.
 */
interface LayoutProps {
  toggleTheme: () => void;
  isDarkMode: boolean;
}

const Layout: React.FC<LayoutProps> = ({ toggleTheme, isDarkMode }) => {
  const [sidebarWidth, setSidebarWidth] = useState(250);
  const [prevSidebarWidth, setPrevSidebarWidth] = useState(250);
  const [transitionTime, setTransitionTime] = useState('0.8s');

  const handleSidebarToggle = () => {
    const newWidth = sidebarWidth === 250 ? 90 : 250;
    setPrevSidebarWidth(sidebarWidth);
    setSidebarWidth(newWidth);
  };

  useEffect(() => {
    if (sidebarWidth < prevSidebarWidth) {
      setTransitionTime('0.5s');
    } else {
      setTransitionTime('0.8s');
    }
  }, [sidebarWidth, prevSidebarWidth]);

  return (
    <Box display='flex'>
      <Box
        sx={{
          transition: `width ${transitionTime} ease`,
          backgroundColor: 'primary.light',
        }}>
        <SideBarNav onToggle={handleSidebarToggle} />
      </Box>
      <Box
        flexGrow={1}
        ml={`${sidebarWidth}px`}
        sx={{ transition: `margin-left ${transitionTime} ease` }}>
        <Box id='main' className='main' mt={8}>
          <Header toggleTheme={toggleTheme} isDarkMode={isDarkMode} sidebarWidth={sidebarWidth} />
          <Box id='right_main' className='right_main'>
            <Outlet />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
