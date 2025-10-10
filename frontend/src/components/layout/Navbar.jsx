import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../../assets/logo.png'; // Most likely correct

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: 'Home', path: '/dashboard', icon: '🏠' },
    { label: 'Explore', path: '/explore', icon: '🔍' },
    { label: 'My Community', path: '/my-community', icon: '👥' },
    { label: 'Events', path: '/events', icon: '📅' },
    { label: 'Announcement', path: '/announcements', icon: '📢' }
  ];

  const communities = [
    { name: 'CSE_bookClub', icon: '📚' },
    { name: 'CSE_Cultural', icon: '🎭' },
    { name: 'CSE_Debate', icon: '💬' },
    { name: 'BBA_Cultural', icon: '🎨' }
  ];

  const isActivePath = (path) => location.pathname === path;

  const handleLogout = () => {
    console.log('User logged out');
    navigate('/login');
  };

  return (
    <>
      {/* Top Header Bar - Fixed at top */}
      <div className="fixed top-0 left-0 right-0 h-[118px] bg-white border-b border-gray-200 z-50 flex items-center justify-between px-8">
        {/* Logo Section - Updated with actual logo */}
        <div className="flex items-center gap-3">
          <img 
            src={logo} 
            alt="Data Drop Logo" 
            className="w-12 h-12 object-contain"
          />
          <div className="flex flex-col">
            <h1 className="text-[#180F57] font-bold text-2xl tracking-wide">DATA DROP</h1>
            <p className="text-[#666666] text-lg">RPSU Forum</p>
          </div>
        </div>

        {/* Search Bar - Updated to match Figma design */}
        <div className="flex-1 max-w-2xl mx-8">
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

        {/* Right Side Buttons - Updated with purple outline */}
        <div className="flex items-center gap-3">
          {/* Notification Button */}
          <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-[#FAF9FF] transition-colors border border-[#533DDE] shadow-sm">
            <span className="text-[#533DDE] text-lg">🔔</span>
          </button>

          {/* Messages Button */}
          <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-[#FAF9FF] transition-colors border border-[#533DDE] shadow-sm">
            <span className="text-[#533DDE] text-lg">💬</span>
          </button>

          {/* Add Post Button */}
          <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-[#FAF9FF] transition-colors border border-[#533DDE] shadow-sm">
            <span className="text-[#533DDE] text-lg">➕</span>
          </button>

          {/* User Profile Button */}
          <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-[#FAF9FF] transition-colors border border-[#533DDE] shadow-sm">
            <span className="text-[#533DDE] text-lg">👤</span>
          </button>
        </div>
      </div>

      {/* Sidebar - Fixed below header */}
      <div className="fixed top-[118px] left-0 h-[calc(100vh-118px)] bg-white border-r border-[#D8D3F8] z-40">
        {/* Desktop Sidebar */}
        <div className="hidden lg:flex flex-col w-[310px] h-full p-6 gap-8">
          {/* OVERVIEW Section */}
          <div>
            <h3 className="text-sm font-semibold text-[#4D4D4D] mb-4 uppercase tracking-wide">OVERVIEW</h3>
            <nav className="space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all ${
                    isActivePath(item.path)
                      ? 'bg-[#ECE9FB] text-[#533DDE] font-semibold'
                      : 'text-[#4D4D4D] hover:bg-gray-50'
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="text-base">{item.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* CREATE COMMUNITY Section */}
          <div>
            <h3 className="text-sm font-semibold text-[#4D4D4D] mb-4 uppercase tracking-wide">CREATE COMMUNITY</h3>
            
            {/* NEW COMMUNITY Button */}
            <button className="w-full mb-6 bg-[#533DDE] text-white py-3 px-4 rounded-xl font-semibold hover:bg-[#311EAE] transition-colors flex items-center justify-center space-x-2">
              <span className="text-xl">+</span>
              <span className="text-base">NEW COMMUNITY</span>
            </button>

            {/* RECENT COMMUNITY Section */}
            <div>
              <h4 className="text-xs font-semibold text-[#999999] mb-3 uppercase tracking-wide">RECENT COMMUNITY</h4>
              <div className="space-y-2">
                {communities.map((community) => (
                  <button
                    key={community.name}
                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-50 text-left transition-colors"
                  >
                    <span className="text-xl">{community.icon}</span>
                    <span className="text-base font-medium text-[#333333]">{community.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <div className="mt-auto pt-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left text-red-600 hover:bg-red-50 transition-colors"
            >
              <span className="text-xl">🚪</span>
              <span className="text-base">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 right-4 z-50">
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-3 rounded-lg bg-white shadow-lg hover:bg-gray-100 border border-gray-200"
        >
          <span className="text-2xl">☰</span>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div 
            className="fixed top-0 left-0 w-80 h-full bg-white shadow-xl p-6 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <div className="flex justify-end mb-6">
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <span className="text-2xl">✕</span>
              </button>
            </div>

            {/* Mobile Menu Content */}
            <div className="space-y-8">
              {/* OVERVIEW Section */}
              <div>
                <h3 className="text-sm font-semibold text-[#4D4D4D] mb-4 uppercase tracking-wide">OVERVIEW</h3>
                <nav className="space-y-2">
                  {navItems.map((item) => (
                    <button
                      key={item.path}
                      onClick={() => {
                        navigate(item.path);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left ${
                        isActivePath(item.path)
                          ? 'bg-[#ECE9FB] text-[#533DDE] font-semibold'
                          : 'text-[#4D4D4D]'
                      }`}
                    >
                      <span className="text-xl">{item.icon}</span>
                      <span className="text-base">{item.label}</span>
                    </button>
                  ))}
                </nav>
              </div>

              {/* CREATE COMMUNITY Section */}
              <div>
                <h3 className="text-sm font-semibold text-[#4D4D4D] mb-4 uppercase tracking-wide">CREATE COMMUNITY</h3>
                <button className="w-full bg-[#533DDE] text-white py-3 px-4 rounded-xl font-semibold mb-6 flex items-center justify-center space-x-2">
                  <span className="text-xl">+</span>
                  <span className="text-base">NEW COMMUNITY</span>
                </button>

                <h4 className="text-xs font-semibold text-[#999999] mb-3 uppercase tracking-wide">RECENT COMMUNITY</h4>
                <div className="space-y-2">
                  {communities.map((community) => (
                    <button
                      key={community.name}
                      className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left"
                    >
                      <span className="text-xl">{community.icon}</span>
                      <span className="text-base font-medium text-[#333333]">{community.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Logout Button */}
              <div className="pt-4 border-t border-gray-200">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left text-red-600 hover:bg-red-50"
                >
                  <span className="text-xl">🚪</span>
                  <span className="text-base">Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;