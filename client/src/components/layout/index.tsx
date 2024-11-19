import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import SideBarNav from '../sideBarNav';
import Header from '../header';

/**
 * Main component represents the layout of the main page, including a sidebar and the main content area.
 */
interface LayoutProps {
  toggleTheme: () => void;
  isDarkMode: boolean;
}

const Layout: React.FC<LayoutProps> = ({ toggleTheme, isDarkMode }) => {
  const [sidebarWidth, setSidebarWidth] = useState(250); 

  const handleSidebarToggle = () => {
    setSidebarWidth(sidebarWidth === 250 ? 90 : 250); 
  };

  return (
    <Box display="flex">
      <SideBarNav onToggle={handleSidebarToggle} />
      <Box flexGrow={1} ml={`${sidebarWidth}px`} sx={{transition: 'margin-left 0.6s ease'}}>
        <Box id="main" className="main" mt={8}>
        <Header toggleTheme={toggleTheme} isDarkMode={isDarkMode} sidebarWidth={sidebarWidth} />
          <Box id="right_main" className="right_main">
            <Outlet />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
