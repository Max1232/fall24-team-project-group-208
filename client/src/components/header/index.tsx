import React from 'react';
import useHeader from '../../hooks/useHeader';
import './index.css';

/**
 * Header component that renders the main title, search bar, and authentication status.
 * The search bar allows the user to input a query and navigate to the search results page
 * when they press Enter.
 */
const Header = () => {
  const { val, handleInputChange, handleKeyDown, user, handleSignOut, loading } = useHeader();

  return (
    <div id='header' className='header'>
      <div className='auth-status'>
        {loading ? (
          <span className='auth-loading'>Loading...</span>
        ) : user ? (
          <div className='user-info'>
            <span>{user.email}</span>
            <button className='sign-out-btn' onClick={handleSignOut}>
              Sign Out
            </button>
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
