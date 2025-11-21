// src/components/layout/EditProfile.jsx
import React, { useState } from 'react';

const EditProfile = () => {
  const [activeSection, setActiveSection] = useState('Edit About me');
  const [profileData, setProfileData] = useState({
    communityName: '',
    aboutMe: '',
    description: '',
    role: 'Student'
  });

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    // Save profile data logic here
    console.log('Saving profile data:', profileData);
    // You can add API call here to save the data
  };

  return (
    <div className="ml-[334px] min-h-screen bg-white font-poppins">
      <div className="pt-32 pl-16 pr-8 max-w-7xl">
        
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-[#1A1A1A] mb-3">My Profile Settings</h1>
          <p className="text-xl text-[#666666]">Manage your profile information and preferences</p>
        </div>

        {/* Edit Profile Name Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-semibold text-[#333333] mb-6">Edit Profile name</h2>
          
          <div className="space-y-4">
            {/* Community Name */}
            <div 
              className={`p-6 rounded-2xl cursor-pointer transition-all ${
                activeSection === 'Community Name' 
                  ? 'bg-[#ECE9FB] border-l-4 border-[#533DDE]' 
                  : 'bg-[#F8F9FF] hover:bg-[#F0EDFF]'
              }`}
              onClick={() => setActiveSection('Community Name')}
            >
              <div className="flex items-center justify-between">
                <span className="text-xl text-[#666666]">Add a Community name</span>
                {activeSection === 'Community Name' && (
                  <input
                    type="text"
                    value={profileData.communityName}
                    onChange={(e) => handleInputChange('communityName', e.target.value)}
                    placeholder="Enter community name..."
                    className="px-4 py-3 border border-[#D8D3F8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#533DDE] text-lg w-80"
                  />
                )}
              </div>
            </div>

            {/* Edit About Me - Active by default */}
            <div 
              className={`p-6 rounded-2xl cursor-pointer transition-all ${
                activeSection === 'Edit About me' 
                  ? 'bg-[#ECE9FB] border-l-4 border-[#533DDE]' 
                  : 'bg-[#F8F9FF] hover:bg-[#F0EDFF]'
              }`}
              onClick={() => setActiveSection('Edit About me')}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xl font-semibold text-[#533DDE]">Edit About me</span>
              </div>
              {activeSection === 'Edit About me' && (
                <textarea
                  value={profileData.aboutMe}
                  onChange={(e) => handleInputChange('aboutMe', e.target.value)}
                  placeholder="Tell us about yourself..."
                  rows="4"
                  className="w-full px-4 py-3 border border-[#D8D3F8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#533DDE] resize-none text-lg"
                />
              )}
            </div>

            {/* Add Description */}
            <div 
              className={`p-6 rounded-2xl cursor-pointer transition-all ${
                activeSection === 'Add Description' 
                  ? 'bg-[#ECE9FB] border-l-4 border-[#533DDE]' 
                  : 'bg-[#F8F9FF] hover:bg-[#F0EDFF]'
              }`}
              onClick={() => setActiveSection('Add Description')}
            >
              <div className="flex items-center justify-between">
                <span className="text-xl text-[#666666]">Add a description</span>
                {activeSection === 'Add Description' && (
                  <textarea
                    value={profileData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Add a description..."
                    rows="3"
                    className="w-80 px-4 py-3 border border-[#D8D3F8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#533DDE] resize-none text-lg"
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Style Profile Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-semibold text-[#333333] mb-6">Style profile</h2>
          
          <div className="space-y-4">
            {/* Add Icon */}
            <div 
              className={`p-6 rounded-2xl cursor-pointer transition-all ${
                activeSection === 'Add Icon' 
                  ? 'bg-[#ECE9FB] border-l-4 border-[#533DDE]' 
                  : 'bg-[#F8F9FF] hover:bg-[#F0EDFF]'
              }`}
              onClick={() => setActiveSection('Add Icon')}
            >
              <div className="flex items-center justify-between">
                <span className="text-xl text-[#666666]">Add icon</span>
                {activeSection === 'Add Icon' && (
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 bg-gray-200 rounded-xl border-2 border-dashed border-[#D8D3F8] flex items-center justify-center">
                      <span className="text-3xl">🖼️</span>
                    </div>
                    <button className="px-6 py-3 bg-[#533DDE] text-white rounded-xl hover:bg-[#4530C9] transition-colors text-lg font-medium">
                      Upload Icon
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Add Banner */}
            <div 
              className={`p-6 rounded-2xl cursor-pointer transition-all ${
                activeSection === 'Add Banner' 
                  ? 'bg-[#ECE9FB] border-l-4 border-[#533DDE]' 
                  : 'bg-[#F8F9FF] hover:bg-[#F0EDFF]'
              }`}
              onClick={() => setActiveSection('Add Banner')}
            >
              <div className="flex items-center justify-between">
                <span className="text-xl text-[#666666]">Add Banner</span>
                {activeSection === 'Add Banner' && (
                  <div className="flex items-center gap-6">
                    <div className="w-40 h-20 bg-gray-200 rounded-xl border-2 border-dashed border-[#D8D3F8] flex items-center justify-center">
                      <span className="text-3xl">🎨</span>
                    </div>
                    <button className="px-6 py-3 bg-[#533DDE] text-white rounded-xl hover:bg-[#4530C9] transition-colors text-lg font-medium">
                      Upload Banner
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Request Role Change */}
            <div 
              className={`p-6 rounded-2xl cursor-pointer transition-all ${
                activeSection === 'Request Role Change' 
                  ? 'bg-[#ECE9FB] border-l-4 border-[#533DDE]' 
                  : 'bg-[#F8F9FF] hover:bg-[#F0EDFF]'
              }`}
              onClick={() => setActiveSection('Request Role Change')}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xl font-semibold text-[#533DDE]">Request role change</span>
              </div>
              
              {activeSection === 'Request Role Change' && (
                <div className="ml-6 space-y-3">
                  <div className="flex items-center gap-4">
                    <input
                      type="radio"
                      id="student"
                      name="role"
                      value="Student"
                      checked={profileData.role === 'Student'}
                      onChange={(e) => handleInputChange('role', e.target.value)}
                      className="w-5 h-5 text-[#533DDE]"
                    />
                    <label htmlFor="student" className="text-xl text-[#666666]">Student</label>
                  </div>
                  <div className="flex items-center gap-4">
                    <input
                      type="radio"
                      id="teacher"
                      name="role"
                      value="Teacher"
                      checked={profileData.role === 'Teacher'}
                      onChange={(e) => handleInputChange('role', e.target.value)}
                      className="w-5 h-5 text-[#533DDE]"
                    />
                    <label htmlFor="teacher" className="text-xl text-[#666666]">Teacher</label>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Save Button - Moved to right bottom */}
        <div className="flex justify-end mt-12">
          <button
            onClick={handleSave}
            className="px-8 py-4 bg-[#533DDE] text-white rounded-xl hover:bg-[#4530C9] transition-colors font-semibold text-xl"
          >
            Save Changes
          </button>
        </div>

      </div>
    </div>
  );
};

export default EditProfile;