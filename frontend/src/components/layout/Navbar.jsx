import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../../assets/logo.jpg';
import CreateCommunity from '../layout/CreateCommunity'; // ✅ Import the modal

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showCreateCommunity, setShowCreateCommunity] = useState(false); // ✅ Modal state
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
      {/* Top Header */}
      <div className="fixed top-0 left-0 right-0 h-[118px] bg-white border-b border-gray-200 z-50 flex items-center justify-between px-8">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <img src={logo} alt="Data Drop Logo" className="w-12 h-12 object-contain" />
          <div className="flex flex-col">
            <h1 className="text-[#180F57] font-bold text-2xl tracking-wide">DATA DROP</h1>
            <p className="text-[#666666] text-lg">RPSU Forum</p>
          </div>
        </div>

        {/* Search Bar */}
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

        {/* Right Buttons */}
        <div className="flex items-center gap-3">
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

      {/* Sidebar */}
      <div className="fixed top-[118px] left-0 h-[calc(100vh-118px)] bg-white border-r border-[#D8D3F8] z-40">
        <div className="hidden lg:flex flex-col w-[310px] h-full p-6 gap-8">
          {/* OVERVIEW */}
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

          {/* CREATE COMMUNITY */}
          <div>
            <h3 className="text-sm font-semibold text-[#4D4D4D] mb-4 uppercase tracking-wide">
              CREATE COMMUNITY
            </h3>

            {/* ✅ New Community Button opens modal */}
            <button
              onClick={() => setShowCreateCommunity(true)}
              className="w-full mb-6 bg-[#533DDE] text-white py-3 px-4 rounded-xl font-semibold hover:bg-[#311EAE] transition-colors flex items-center justify-center space-x-2"
            >
              <span className="text-xl">+</span>
              <span className="text-base">NEW COMMUNITY</span>
            </button>

            {/* RECENT COMMUNITY */}
            <div>
              <h4 className="text-xs font-semibold text-[#999999] mb-3 uppercase tracking-wide">
                RECENT COMMUNITY
              </h4>
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

          {/* Logout */}
          <div className="pt-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left text-[#533DDE] bg-transparent hover:!bg-[#ECE9FB] hover:!text-[#533DDE] transition-colors duration-200"
            >
              <span className="text-xl">🚪</span>
              <span className="text-base font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* ✅ Modal Overlay for CreateCommunity */}
      {showCreateCommunity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 w-[700px] relative shadow-2xl">
            <button
              onClick={() => setShowCreateCommunity(false)}
              className="absolute top-5 right-5 text-gray-500 hover:text-gray-800 text-2xl"
            >
              ✕
            </button>
            <CreateCommunity onClose={() => setShowCreateCommunity(false)} />
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
