import React, { useState } from 'react';
import useHeader from '../../hooks/useHeader';
import './index.css';

/**
 * Header component that renders the main title, search bar, and authentication status.
 * The search bar allows the user to input a query and navigate to the search results page
 * when they press Enter.
 */
const Header: React.FC = () => {
  const { val, handleInputChange, handleKeyDown, user, handleSignOut, loading } = useHeader();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  // Header includes dropdown menu linking to logout and profile
  return (
    <div id='header' className='header'>
      <div className='auth-status'>
        {loading ? (
          <span className='auth-loading'>Loading...</span>
        ) : user ? (
          <div className='user-info'>
            <button className='user-dropdown-btn' onClick={toggleDropdown}>
              {user.email}
            </button>
            {dropdownOpen && (
              <div className='dropdown-menu'>
                <ul>
                  <li
                    className='dropdown-item'
                    onClick={() => {
                      /* to be implemented */
                    }}>
                    Profile
                  </li>
                  <li className='dropdown-item' onClick={handleSignOut}>
                    Sign Out
                  </li>
                </ul>
              </div>
            )}
          </div>
        ) : null}
      </div>
      <div className='title'>Fake Stack Overflow</div>
      <input
        id='searchBar'
        placeholder='Search ...'
        type='text'
        value={val}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
};

export default Header;
