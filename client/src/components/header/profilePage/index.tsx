import React from 'react';
import './index.css';

/**
 * ProfilePage component that displays the user's information.
 * Components are not final
 */
const ProfilePage: React.FC = () => {
  // Temp. test user
  const user = {
    name: 'John Developer',
    level: 'Level 1',
    reputationPoints: 125, // Based on karma rep
    progressToNextLevel: 125, // based on karma rep
    levelThreshold: 200, // will change this to be based on level (higher levels take more)
    // not sure how we track this
    answers: 23,
    questions: 15,
    acceptedAnswers: 12,
    badges: ['First Answer', 'Knowledge Seeker', 'Expert'],
  };

  return (
    <div className='profile-page-container'>
      <div className='profile-card'>
        <div className='profile-header'>
          <div className='profile-avatar'>
            {/* Avatar */}
            <span className='avatar-icon'>:O</span>
          </div>
          <div className='profile-info'>
            <h2 className='profile-name'>{user.name}</h2>
            <p className='profile-level'>
              {user.level} - {user.reputationPoints} reputation points
            </p>
          </div>
        </div>
        <div className='profile-progress'>
          <span className='progress-label'>
            Progress to Level {parseInt(user.level.split(' ')[1], 10) + 1}
          </span>
          <div className='progress-bar'>
            <div
              className='progress-filled'
              style={{ width: `${(user.progressToNextLevel / user.levelThreshold) * 100}%` }}></div>
          </div>
          <span className='progress-values'>
            {user.progressToNextLevel}/{user.levelThreshold}
          </span>
        </div>
        <div className='profile-stats'>
          <div className='profile-stat'>
            <span className='stat-label'>Answers</span>
            <span className='stat-value'>{user.answers}</span>
          </div>
          <div className='profile-stat'>
            <span className='stat-label'>Questions</span>
            <span className='stat-value'>{user.questions}</span>
          </div>
          <div className='profile-stat'>
            <span className='stat-label'>Accepted Answers</span>
            <span className='stat-value'>{user.acceptedAnswers}</span>
          </div>
        </div>
        <div className='profile-badges'>
          <h3 className='badges-title'>Badges</h3>
          <div className='badges-list'>
            {user.badges.map((badge, index) => (
              <div key={index} className='badge-item'>
                {badge}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
