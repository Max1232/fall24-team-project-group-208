import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Box, IconButton, Collapse, ListItem, ListItemIcon, ListItemText, Typography } from '@mui/material';
import { ArrowBackIos, ArrowForwardIos, QuestionAnswer, LocalOffer, Quiz, Settings, AccountCircle } from '@mui/icons-material';


/**
 * The SideBarNav component has five menu items: "Questions", "Tags", "Quizzes", "Settings", and "Profile".
 * It highlights the currently selected item based on the active page and
 * triggers corresponding functions when the menu items are clicked.
 */
interface SideBarNavProps {
  onToggle: () => void;
}

const SideBarNav: React.FC<SideBarNavProps> = ({ onToggle }) => {
  const [expanded, setExpanded] = useState(true);

  const handleToggle = () => {
    setExpanded(!expanded);
    onToggle();
  };

  return (
    <Box
      id="sideBarNav"
      className="sideBarNav"
      sx={{
        position: 'fixed',
        height: '100vh',
        width: expanded ? 240 : 80,
        transition: 'width 0.3s',
        backgroundColor: 'primary.light',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: 2,
      }}
    >
      <Box sx={{ flexGrow: 1, width: '100%' }}>
      <ListItem component="li" sx={{ justifyContent: expanded ? 'flex-start' : 'center', paddingLeft: expanded ? 2 : 0 }}>
            <ListItemIcon sx={{ minWidth: 'auto' }}>
              <img src="/devask-logo_pink-circle.png" alt="DevAsk Icon" style={{ width: 80, height: 80 }} />
            </ListItemIcon>
            <Collapse in={expanded} orientation="horizontal">
              <ListItemText
                primary={
                  <Typography variant="h2" sx={{  color: expanded ? 'secondary.light' : 'transparent'  }}>
                    DevAsk
                  </Typography>
                }
              />
            </Collapse>
          </ListItem>
        <NavLink
          to="/home"
          id="menu_questions"
          className={({ isActive }) => `menu_button ${isActive ? 'menu_selected' : ''}`}
          style={{ textDecoration: 'none', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <ListItem component="li">
            <ListItemIcon>
              <QuestionAnswer sx={{ fontSize: 30, color:'#fff'}}/>
            </ListItemIcon>
            <Collapse in={expanded} orientation="horizontal">
              <ListItemText primary="Questions" sx={{color: expanded ? '#fff': 'transparent'}}/>
            </Collapse>
          </ListItem>
        </NavLink>
        <NavLink
          to="/tags"
          id="menu_tags"
          className={({ isActive }) => `menu_button ${isActive ? 'menu_selected' : ''}`}
          style={{ textDecoration: 'none', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <ListItem component="li">
            <ListItemIcon>
              <LocalOffer sx={{ fontSize: 30, color:'#fff' }} />
            </ListItemIcon>
            <Collapse in={expanded} orientation="horizontal">
              <ListItemText primary="Tags" sx={{color: expanded ? '#fff': 'transparent'}} />
            </Collapse>
          </ListItem>
        </NavLink>
        <NavLink
          to="/quizzes"
          id="menu_quizzes"
          className={({ isActive }) => `menu_button ${isActive ? 'menu_selected' : ''}`}
          style={{ textDecoration: 'none', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <ListItem component="li">
            <ListItemIcon>
              <Quiz sx={{ fontSize: 30, color:'#fff' }} />
            </ListItemIcon>
            <Collapse in={expanded} orientation="horizontal">
              <ListItemText primary="Quizzes" sx={{color: expanded ? '#fff': 'transparent'}}/>
            </Collapse>
          </ListItem>
        </NavLink>
        <NavLink
          to="/settings"
          id="menu_settings"
          className={({ isActive }) => `menu_button ${isActive ? 'menu_selected' : ''}`}
          style={{ textDecoration: 'none', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <ListItem component="li">
            <ListItemIcon>
              <Settings sx={{ fontSize: 30, color:'#fff' }} />
            </ListItemIcon>
            <Collapse in={expanded} orientation="horizontal">
              <ListItemText primary="Settings" sx={{color: expanded ? '#fff': 'transparent'}}/>
            </Collapse>
          </ListItem>
        </NavLink>
      </Box>
      <Box sx={{ width: '100%', textAlign: 'center' }}>
        <IconButton onClick={handleToggle} sx={{ mb: 1 }}>
          {expanded ? <ArrowBackIos sx={{color:'#fff'}}/> : <ArrowForwardIos sx={{color:'#fff'}}/>}
        </IconButton>
        <NavLink
          to="/profile"
          id="menu_profile"
          className={({ isActive }) => `menu_button ${isActive ? 'menu_selected' : ''}`}
          style={{ textDecoration: 'none', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <ListItem component="li">
            <ListItemIcon>
              <AccountCircle sx={{ fontSize: 30, color:'#fff' }} />
            </ListItemIcon>
            <Collapse in={expanded} orientation="horizontal">
              <ListItemText primary="Profile" sx={{color: expanded ? '#fff': 'transparent'}}/>
            </Collapse>
          </ListItem>
        </NavLink>
      </Box>
    </Box>
  );
};

export default SideBarNav;
