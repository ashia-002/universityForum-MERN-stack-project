// src/components/layout/Profile.jsx
import React, { useState } from 'react';
import ProfileNavbar from './ProfileNavbar';
import UserProfile from './UserProfile';
import EditProfile from './EditProfile';

const Profile = () => {
  const [currentView, setCurrentView] = useState('user-profile'); // 'user-profile' or 'edit-profile'

  const handleViewChange = (view) => {
    setCurrentView(view);
  };

  return (
    <div className="min-h-screen bg-white">
      <ProfileNavbar 
        currentView={currentView}
        onViewChange={handleViewChange}
      />
      
      {/* Conditionally render the main content */}
      {currentView === 'user-profile' && <UserProfile />}
      {currentView === 'edit-profile' && <EditProfile />}
    </div>
  );
};

export default Profile;