// src/components/layout/ProfileNavbar.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import logo from "../../assets/logo.png";

const ProfileNavbar = ({ currentView, onViewChange }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeItem, setActiveItem] = useState('');

  const handleExitProfile = () => {
    if (currentView === 'edit-profile') {
      onViewChange('user-profile');
      setActiveItem('');
    } else {
      navigate('/dashboard');
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleItemClick = (itemName) => {
    setActiveItem(itemName);
    if (itemName === 'Edit Profile') {
      onViewChange('edit-profile');
    } else {
      onViewChange('user-profile');
    }
  };

  // Custom checkbox icons as SVG components
  const CheckboxUnchecked = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect x="4" y="4" width="16" height="16" rx="2" stroke="#B1A8F0" strokeWidth="1.5"/>
    </svg>
  );

  const CheckboxChecked = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect x="4" y="4" width="16" height="16" rx="2" fill="#533DDE" stroke="#533DDE" strokeWidth="1.5"/>
      <path d="M8 12L11 15L16 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  const BookmarkedPostIcon = ({ isActive }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect x="4" y="4" width="16" height="16" rx="2" stroke={isActive ? "#533DDE" : "#B1A8F0"} strokeWidth="1.5"/>
    </svg>
  );

  const InterestedEventsIcon = ({ isActive }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect x="4" y="4" width="16" height="16" rx="2" stroke={isActive ? "#533DDE" : "#B1A8F0"} strokeWidth="1.5"/>
      <path d="M8 8H16" stroke={isActive ? "#533DDE" : "#B1A8F0"} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M8 12H16" stroke={isActive ? "#533DDE" : "#B1A8F0"} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M8 16H12" stroke={isActive ? "#533DDE" : "#B1A8F0"} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );

  const BookmarkedAnnouncementIcon = ({ isActive }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M4 4H20V16L12 20L4 16V4Z" stroke={isActive ? "#533DDE" : "#B1A8F0"} strokeWidth="1.5" fill="none"/>
      <path d="M12 8V12" stroke={isActive ? "#533DDE" : "#B1A8F0"} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M12 16H12.01" stroke={isActive ? "#533DDE" : "#B1A8F0"} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );

  const TotalPostIcon = ({ isActive }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" fill={isActive ? "#533DDE" : "#B1A8F0"} stroke={isActive ? "#533DDE" : "#B1A8F0"} strokeWidth="0.4"/>
    </svg>
  );

  const TotalEventsIcon = ({ isActive }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M8 6V4" stroke={isActive ? "#533DDE" : "#B1A8F0"} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M16 6V4" stroke={isActive ? "#533DDE" : "#B1A8F0"} strokeWidth="1.5" strokeLinecap="round"/>
      <rect x="4" y="6" width="16" height="14" rx="2" stroke={isActive ? "#533DDE" : "#B1A8F0"} strokeWidth="1.5"/>
      <path d="M4 12H20" stroke={isActive ? "#533DDE" : "#B1A8F0"} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M8 16H16" stroke={isActive ? "#533DDE" : "#B1A8F0"} strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );

  const TotalAnnouncementsIcon = ({ isActive }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M4 4H20V16L12 20L4 16V4Z" stroke={isActive ? "#533DDE" : "#B1A8F0"} strokeWidth="1.5" fill="none"/>
      <path d="M12 8V12" stroke={isActive ? "#533DDE" : "#B1A8F0"} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M12 16H12.01" stroke={isActive ? "#533DDE" : "#B1A8F0"} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );

  const TotalCommunityIcon = ({ isActive }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M17 20H22V18C22 16.343 20.657 15 19 15C18.044 15 17.193 15.447 16.644 16.142" stroke={isActive ? "#533DDE" : "#B1A8F0"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M15 14C16.657 14 18 12.657 18 11C18 9.343 16.657 8 15 8C13.343 8 12 9.343 12 11C12 12.657 13.343 14 15 14Z" stroke={isActive ? "#533DDE" : "#B1A8F0"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M7 14C8.657 14 10 12.657 10 11C10 9.343 8.657 8 7 8C5.343 8 4 9.343 4 11C4 12.657 5.343 14 7 14Z" stroke={isActive ? "#533DDE" : "#B1A8F0"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M1 20V18C1 16.343 2.343 15 4 15C5.657 15 7 16.343 7 18V20" stroke={isActive ? "#533DDE" : "#B1A8F0"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  const ExitIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M19 12H5" stroke="#533DDE" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 19L5 12L12 5" stroke="#533DDE" strokeWidth="1.5" strokeLinejoin="round"/>
    </svg>
  );

  const EditProfileIcon = ({ isActive }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M11 4H4C3.44772 4 3 4.44772 3 5V19C3 19.5523 3.44772 20 4 20H18C18.5523 20 19 19.5523 19 19V12" stroke={isActive ? "#533DDE" : "#533DDE"} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M18.5 2.5C18.8978 2.10217 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10217 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10217 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke={isActive ? "#533DDE" : "#533DDE"} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  const LogoutIcon = () => (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
      <path d="M15 13L10 18L15 23" stroke="#ECE9FB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M10 18H22" stroke="#ECE9FB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M16 10H26C27.105 10 28 10.895 28 12V28C28 29.105 27.105 30 26 30H16" stroke="#ECE9FB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  const SidebarContent = () => (
    <div className="flex flex-col w-full h-full p-[20px_25px] gap-10">
      {/* Exit Edit Profile */}
      <button
        onClick={handleExitProfile}
        className="flex flex-row items-center p-[16px_80px_16px_44px] gap-4 w-[284px] h-[60px] rounded-[10px] hover:bg-[#F0EDFF] transition-colors"
      >
        <ExitIcon />
        <span className="font-poppins font-normal text-lg leading-[27px] text-[#533DDE]">
          {currentView === 'edit-profile' ? 'Exit Edit Profile' : 'Back to Dashboard'}
        </span>
      </button>

      {/* Edit Profile Section */}
      <div className="flex flex-col items-start p-0 gap-4 w-[284px] h-[288px]">
        {/* Edit Profile - Active State */}
        <button
          onClick={() => handleItemClick('Edit Profile')}
          className={`box-border flex flex-row items-center p-[16px_80px_16px_44px] gap-4 w-[284px] h-[60px] rounded-[10px] transition-all ${
            activeItem === 'Edit Profile' 
              ? 'bg-white border-r-[3px] border-[#533DDE] shadow-[0px_6px_18px_rgba(100,81,225,0.16)]' 
              : 'bg-white hover:bg-[#F0EDFF]'
          }`}
        >
          <EditProfileIcon isActive={activeItem === 'Edit Profile'} />
          <span className={`font-poppins font-normal text-lg leading-[27px] ${
            activeItem === 'Edit Profile' ? 'text-[#333333]' : 'text-[#333333]'
          }`}>
            Edit Profile
          </span>
        </button>

        {/* Profile Options */}
        <div className="flex flex-col w-full gap-2">
          {/* Bookmarked Post */}
          <button
            onClick={() => handleItemClick('Bookmarked Post')}
            className={`flex flex-row items-center p-[16px_71px_16px_44px] gap-4 w-[284px] h-[60px] rounded-[16px] transition-all ${
              activeItem === 'Bookmarked Post' ? 'bg-[#ECE9FB]' : 'hover:bg-[#F0EDFF]'
            }`}
          >
            <BookmarkedPostIcon isActive={activeItem === 'Bookmarked Post'} />
            <span className={`font-poppins font-normal text-lg leading-[27px] ${
              activeItem === 'Bookmarked Post' ? 'text-[#533DDE]' : 'text-[#666666]'
            }`}>
              Bookmarked Post
            </span>
          </button>

          {/* Interested Events */}
          <button
            onClick={() => handleItemClick('Interested Events')}
            className={`flex flex-row items-center p-[16px_80px_16px_44px] gap-4 w-[284px] h-[60px] rounded-[10px] transition-all ${
              activeItem === 'Interested Events' ? 'bg-[#ECE9FB]' : 'hover:bg-[#F0EDFF]'
            }`}
          >
            <CheckboxChecked />
            <span className={`font-poppins font-normal text-lg leading-[27px] ${
              activeItem === 'Interested Events' ? 'text-[#533DDE]' : 'text-[#666666]'
            }`}>
              Interested Events
            </span>
          </button>

          {/* Bookmarked Announcement */}
          <button
            onClick={() => handleItemClick('Bookmarked Announcement')}
            className={`flex flex-row items-center p-[16px_36px_16px_44px] gap-4 w-[284px] h-[60px] rounded-[16px] transition-all ${
              activeItem === 'Bookmarked Announcement' ? 'bg-[#ECE9FB]' : 'hover:bg-[#F0EDFF]'
            }`}
          >
            <BookmarkedAnnouncementIcon isActive={activeItem === 'Bookmarked Announcement'} />
            <span className={`font-poppins font-normal text-lg leading-[27px] ${
              activeItem === 'Bookmarked Announcement' ? 'text-[#533DDE]' : 'text-[#666666]'
            }`}>
              Bookmarked Announcement
            </span>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="flex flex-col items-start p-0 gap-2 w-[284px] h-[293px]">
        <h3 className="w-[284px] h-[21px] font-poppins font-normal text-[14px] leading-[21px] tracking-[0.04em] text-[#666666] uppercase">
          RECENT ACTIVITY
        </h3>
        
        <div className="flex flex-col items-start p-0 gap-2 w-[284px] h-[264px]">
          {/* Total Post */}
          <button
            onClick={() => handleItemClick('Total Post')}
            className={`flex flex-row items-center p-[16px_71px_16px_44px] gap-4 w-[284px] h-[60px] rounded-[16px] transition-all ${
              activeItem === 'Total Post' ? 'bg-[#ECE9FB]' : 'hover:bg-[#F0EDFF]'
            }`}
          >
            <TotalPostIcon isActive={activeItem === 'Total Post'} />
            <span className={`font-poppins font-normal text-lg leading-[27px] ${
              activeItem === 'Total Post' ? 'text-[#533DDE]' : 'text-[#666666]'
            }`}>
              Total Post
            </span>
          </button>

          {/* Total Events */}
          <button
            onClick={() => handleItemClick('Total Events')}
            className={`flex flex-row items-center p-[16px_71px_16px_44px] gap-4 w-[284px] h-[60px] rounded-[16px] transition-all ${
              activeItem === 'Total Events' ? 'bg-[#ECE9FB]' : 'hover:bg-[#F0EDFF]'
            }`}
          >
            <TotalEventsIcon isActive={activeItem === 'Total Events'} />
            <span className={`font-poppins font-normal text-lg leading-[27px] ${
              activeItem === 'Total Events' ? 'text-[#533DDE]' : 'text-[#666666]'
            }`}>
              Total Events
            </span>
          </button>

          {/* Total Announcements */}
          <button
            onClick={() => handleItemClick('Total Announcements')}
            className={`flex flex-row items-center p-[16px_71px_16px_44px] gap-4 w-[284px] h-[60px] rounded-[16px] transition-all ${
              activeItem === 'Total Announcements' ? 'bg-[#ECE9FB]' : 'hover:bg-[#F0EDFF]'
            }`}
          >
            <TotalAnnouncementsIcon isActive={activeItem === 'Total Announcements'} />
            <span className={`font-poppins font-normal text-lg leading-[27px] ${
              activeItem === 'Total Announcements' ? 'text-[#533DDE]' : 'text-[#666666]'
            }`}>
              Total Announcements
            </span>
          </button>

          {/* Total Community */}
          <button
            onClick={() => handleItemClick('Total Community')}
            className={`flex flex-row items-center p-[16px_71px_16px_44px] gap-4 w-[284px] h-[60px] rounded-[16px] transition-all ${
              activeItem === 'Total Community' ? 'bg-[#ECE9FB]' : 'hover:bg-[#F0EDFF]'
            }`}
          >
            <TotalCommunityIcon isActive={activeItem === 'Total Community'} />
            <span className={`font-poppins font-normal text-lg leading-[27px] ${
              activeItem === 'Total Community' ? 'text-[#533DDE]' : 'text-[#666666]'
            }`}>
              Total Community
            </span>
          </button>
        </div>
      </div>

      {/* Delete Profile & Logout */}
      <div className="flex flex-col items-start p-0 gap-[72px] w-[284px] h-[188px] mt-auto">
        {/* Delete Profile */}
        <button 
          onClick={() => handleItemClick('Delete Profile')}
          className={`box-border flex flex-row justify-center items-center p-[16px_0px] gap-4 w-[284px] h-[60px] border border-[#E33131] rounded-[10px] transition-all ${
            activeItem === 'Delete Profile' ? 'bg-red-50' : 'hover:bg-red-50'
          }`}
        >
          <span className="font-poppins font-normal text-lg leading-[27px] text-[#E33131]">
            Delete Profile
          </span>
        </button>

        {/* Logout */}
        <button
          onClick={() => {
            handleItemClick('Logout');
            logout();
          }}
          className={`flex flex-row justify-center items-center p-[0px_24px] gap-4 w-[284px] h-[56px] rounded-[10px] transition-all ${
            activeItem === 'Logout' 
              ? 'bg-[#4530C9] shadow-[0px_6px_18px_rgba(100,81,225,0.16)]' 
              : 'bg-[#533DDE] shadow-[0px_6px_18px_rgba(100,81,225,0.16)] hover:bg-[#4530C9]'
          }`}
        >
          <LogoutIcon />
          <span className="font-poppins font-normal text-lg leading-[27px] text-[#F2F2F2]">
            Logout
          </span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* TOP HEADER */}
      <div className="fixed top-0 left-0 right-0 h-[118px] bg-white border-b border-gray-200 z-50 flex items-center justify-between px-4 sm:px-6 md:px-8">
        {/* Mobile Hamburger Button */}
        <div className="lg:hidden">
          <button
            onClick={toggleMobileMenu}
            className="w-10 h-10 bg-white rounded-xl flex items-center justify-center hover:bg-[#FAF9FF] transition-colors border border-[#533DDE] shadow-sm"
          >
            <span className="text-[#533DDE] text-xl">
              {isMobileMenuOpen ? '✕' : '☰'}
            </span>
          </button>
        </div>

        {/* Logo */}
        <div className="flex items-center gap-3">
          <img src={logo} alt="Data Drop Logo" className="w-12 h-12 object-contain" />
          <div className="flex flex-col">
            <h1 className="text-[#180F57] font-bold text-2xl tracking-wide">DATA DROP</h1>
            <p className="text-[#666666] text-lg">RPSU Forum</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className={`flex-1 max-w-2xl mx-4 md:mx-8 ${isMobileMenuOpen ? 'hidden md:block' : 'block'}`}>
          <div className="relative">
            <input
              type="text"
              placeholder="Type to search"
              className="w-full bg-white rounded-xl py-3 px-6 pl-12 focus:outline-none focus:ring-2 focus:ring-[#533DDE] text-lg border border-[#E5E5E5] focus:border-[#533DDE] transition-colors"
            />
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#533DDE] text-lg">
              🔍
            </span>
          </div>
        </div>

        {/* Right Buttons */}
        <div className={`flex items-center gap-3 ${isMobileMenuOpen ? 'hidden md:flex' : 'flex'}`}>
          <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-[#FAF9FF] transition-colors border border-[#533DDE] shadow-sm">
            <span className="text-[#533DDE] text-lg">🔔</span>
          </button>
          <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-[#FAF9FF] transition-colors border border-[#533DDE] shadow-sm">
            <span className="text-[#533DDE] text-lg">💬</span>
          </button>
          <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-[#FAF9FF] transition-colors border border-[#533DDE] shadow-sm">
            <span className="text-[#533DDE] text-lg">➕</span>
          </button>
          <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-[#FAF9FF] transition-colors border border-[#533DDE] shadow-sm">
            <span className="text-[#533DDE] text-lg">👤</span>
          </button>
        </div>
      </div>

      {/* DESKTOP PROFILE SIDEBAR */}
      <div className="fixed top-[118px] left-0 w-[334px] h-[calc(100vh-118px)] bg-white border-r border-[#D8D3F8] z-40 overflow-y-auto">
        <div className="hidden lg:block">
          <SidebarContent />
        </div>
      </div>

      {/* MOBILE PROFILE SIDEBAR */}
      {isMobileMenuOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          <div className="fixed top-[118px] left-0 h-[calc(100vh-118px)] bg-white border-r border-[#D8D3F8] z-40 w-[334px] lg:hidden overflow-y-auto">
            <SidebarContent />
          </div>
        </>
      )}
    </>
  );
};

export default ProfileNavbar;