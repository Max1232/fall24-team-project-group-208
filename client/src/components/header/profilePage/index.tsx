import React from 'react';
// eslint-disable-next-line import/no-named-as-default
import useProfilePage from '../../../hooks/useProfilePage';

const StatCard = ({ label, value }: { label: string; value: number | undefined }) => (
  <div className='profile-stat'>
    <span className='stat-label'>{label}</span>
    <span className='stat-value'>{value ?? 0}</span>
  </div>
);

const ProfilePage: React.FC = () => {
  const { profileData, loading, error } = useProfilePage();

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500' />
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='bg-red-50 text-red-600 p-4 rounded-lg'>{error}</div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-gray-500'>No profile data available</div>
      </div>
    );
  }

  return (
    <div className='profile-page-container'>
      <div className='profile-card'>
        <div className='profile-header'>
          <div className='profile-avatar'>
            <span className='avatar-icon'>
              {profileData.username.charAt(0).toUpperCase()}
              {profileData.username.charAt(1).toUpperCase()}
            </span>
          </div>
          <div className='profile-info'>
            <h1 className='profile-name'>{profileData.username}</h1>
            <p className='profile-level'>
              Level {profileData.level ?? 1} • {profileData.reputation ?? 0} reputation points
            </p>
          </div>
        </div>

        <div className='profile-progress'>
          <span className='progress-label'>Progress to Level {(profileData.level ?? 1) + 1}</span>
          <div className='progress-bar'>
            <div
              className='progress-filled'
              style={{
                width: `${((profileData.levelProgress ?? 0) / (profileData.levelThreshold ?? 100)) * 100}%`,
              }}
            />
          </div>
          <span className='progress-values'>
            {profileData.levelProgress ?? 0}/{profileData.levelThreshold ?? 100}
          </span>
        </div>

        <div className='profile-stats'>
          <StatCard label='Answers' value={profileData.answers} />
          <StatCard label='Questions' value={profileData.questions} />
          <StatCard label='Accepted Answers' value={profileData.acceptedAnswers} />
        </div>

        <div className='profile-badges'>
          <h2 className='badges-title'>Badges ({(profileData.badges ?? []).length})</h2>
          <div className='badges-list'>
            {(profileData.badges ?? []).map((badge, index) => (
              <div key={index} className='badge-item'>
                {badge}
              </div>
            ))}
          </div>
        </div>

        {profileData.joinedDate && (
          <div className='profile-join-date'>
            Member since {new Date(profileData.joinedDate).toLocaleDateString()}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
