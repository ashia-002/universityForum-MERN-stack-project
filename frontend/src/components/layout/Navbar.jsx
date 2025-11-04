import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../../assets/logo.jpg';
import CreateCommunity from '../layout/CreateCommunity';
import api from '../../services/api';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showCreateCommunity, setShowCreateCommunity] = useState(false);
  const [isMyCommunityOpen, setIsMyCommunityOpen] = useState(false);
  const [createdCommunities, setCreatedCommunities] = useState([]); // ✅ Only created communities
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: 'Home', path: '/dashboard', icon: '🏠' },
    { label: 'Explore', path: '/explore', icon: '🔍' },
    { label: 'My Community', path: '/my-community', icon: '👥' },
    { label: 'Events', path: '/events', icon: '📅' },
    { label: 'Announcement', path: '/announcements', icon: '📢' }
  ];

  const isActivePath = (path) => location.pathname === path;

  const handleLogout = () => {
    console.log('User logged out');
    navigate('/login');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleNavClick = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  // ✅ Added: Toggle MY COMMUNITY dropdown
  const toggleMyCommunity = () => {
    setIsMyCommunityOpen(!isMyCommunityOpen);
  };

  // ✅ Added: Fetch only created communities
  useEffect(() => {
    const fetchCreatedCommunities = async () => {
      try {
        setLoading(true);
        const response = await api.get("/community/view-all");
        const communitiesData = response.data.communities || [];
        
        const currentUserId = getCurrentUserId();
        const userCreatedCommunities = communitiesData
          .filter(community => {
            if (!community.created_by) return false;
            if (typeof community.created_by === 'object') {
              return community.created_by._id === currentUserId || community.created_by.id === currentUserId;
            }
            return community.created_by === currentUserId;
          })
          .map(community => ({
            id: community._id,
            name: community.name,
            icon: '👥' // Default icon, you can customize based on community type
          }));
        
        setCreatedCommunities(userCreatedCommunities);
      } catch (err) {
        console.error("Failed to fetch created communities:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCreatedCommunities();
  }, []);

  // Helper function to get current user ID
  const getCurrentUserId = () => {
    try {
      const userData = localStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        return user._id || user.id || user.userId;
      }
      const token = localStorage.getItem('token');
      if (token) {
        return localStorage.getItem('userId');
      }
    } catch (e) {
      console.error("Error getting user ID:", e);
    }
    return "current-user-id-123";
  };

  return (
    <>
      {/* Top Header */}
      <div className="fixed top-0 left-0 right-0 h-[118px] bg-white border-b border-gray-200 z-50 flex items-center justify-between px-4 sm:px-6 md:px-8">
        {/* Mobile Hamburger Button - Visible only on small screens */}
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

        {/* Search Bar - Hidden on mobile when menu is open */}
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

        {/* Right Buttons - Hidden on mobile when menu is open */}
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

      {/* Desktop Sidebar - Hidden on mobile */}
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

            <button
              onClick={() => setShowCreateCommunity(true)}
              className="w-full mb-3 bg-[#533DDE] text-white py-3 px-4 rounded-xl font-semibold hover:bg-[#311EAE] transition-colors flex items-center justify-center space-x-2"
            >
              <span className="text-xl">+</span>
              <span className="text-base">NEW COMMUNITY</span>
            </button>

            {/* ✅ Updated: MY COMMUNITY Dropdown Button (Only Created Communities) */}
            <button
              onClick={toggleMyCommunity}
              className="w-full mb-6 bg-[#F8F9FF] text-[#533DDE] py-3 px-4 rounded-xl font-semibold hover:bg-[#ECE9FB] transition-colors flex items-center justify-between"
            >
              <div className="flex items-center space-x-2">
                <span className="text-xl">👥</span>
                <span className="text-base">MY COMMUNITY</span>
              </div>
              <span className={`text-[#533DDE] transition-transform ${isMyCommunityOpen ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </button>

            {/* ✅ Updated: MY COMMUNITY Dropdown Content (Only Created Communities) */}
            {isMyCommunityOpen && (
              <div className="mb-6 bg-[#FAF9FF] rounded-xl p-3 border border-[#ECE9FB]">
                <div className="space-y-2">
                  {loading ? (
                    <div className="text-center py-2 text-sm text-[#666666]">Loading...</div>
                  ) : createdCommunities.length > 0 ? (
                    createdCommunities.map((community) => (
                      <button
                        key={community.id}
                        className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-[#F0EDFF] text-left transition-colors"
                        onClick={() => navigate(`/community/${community.id}`)}
                      >
                        <span className="text-xl">{community.icon}</span>
                        <span className="text-base font-medium text-[#333333]">{community.name}</span>
                      </button>
                    ))
                  ) : (
                    <div className="text-center py-2 text-sm text-[#666666]">No communities created yet</div>
                  )}
                </div>
              </div>
            )}

            {/* ✅ Updated: RECENT COMMUNITY (Empty for now) */}
            <div>
              <h4 className="text-xs font-semibold text-[#999999] mb-3 uppercase tracking-wide">
                RECENT COMMUNITY
              </h4>
              <div className="space-y-2">
                <div className="text-center py-4">
                  <p className="text-sm text-[#666666]">No recent communities</p>
                  <p className="text-xs text-[#999] mt-1">Communities you visit will appear here</p>
                </div>
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

      {/* Mobile Sidebar Overlay - Visible only on small screens when menu is open */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* Mobile Sidebar */}
          <div className="fixed top-[118px] left-0 h-[calc(100vh-118px)] bg-white border-r border-[#D8D3F8] z-40 w-[310px] lg:hidden">
            <div className="flex flex-col w-full h-full p-6 gap-8 overflow-y-auto">
              {/* OVERVIEW */}
              <div>
                <h3 className="text-sm font-semibold text-[#4D4D4D] mb-4 uppercase tracking-wide">OVERVIEW</h3>
                <nav className="space-y-2">
                  {navItems.map((item) => (
                    <button
                      key={item.path}
                      onClick={() => handleNavClick(item.path)}
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

                <button
                  onClick={() => {
                    setShowCreateCommunity(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full mb-3 bg-[#533DDE] text-white py-3 px-4 rounded-xl font-semibold hover:bg-[#311EAE] transition-colors flex items-center justify-center space-x-2"
                >
                  <span className="text-xl">+</span>
                  <span className="text-base">NEW COMMUNITY</span>
                </button>

                {/* ✅ Updated: MY COMMUNITY Dropdown Button for Mobile (Only Created Communities) */}
                <button
                  onClick={toggleMyCommunity}
                  className="w-full mb-6 bg-[#F8F9FF] text-[#533DDE] py-3 px-4 rounded-xl font-semibold hover:bg-[#ECE9FB] transition-colors flex items-center justify-between"
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-xl">👥</span>
                    <span className="text-base">MY COMMUNITY</span>
                  </div>
                  <span className={`text-[#533DDE] transition-transform ${isMyCommunityOpen ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                </button>

                {/* ✅ Updated: MY COMMUNITY Dropdown Content for Mobile (Only Created Communities) */}
                {isMyCommunityOpen && (
                  <div className="mb-6 bg-[#FAF9FF] rounded-xl p-3 border border-[#ECE9FB]">
                    <div className="space-y-2">
                      {loading ? (
                        <div className="text-center py-2 text-sm text-[#666666]">Loading...</div>
                      ) : createdCommunities.length > 0 ? (
                        createdCommunities.map((community) => (
                          <button
                            key={community.id}
                            className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-[#F0EDFF] text-left transition-colors"
                            onClick={() => {
                              navigate(`/community/${community.id}`);
                              setIsMobileMenuOpen(false);
                            }}
                          >
                            <span className="text-xl">{community.icon}</span>
                            <span className="text-base font-medium text-[#333333]">{community.name}</span>
                          </button>
                        ))
                      ) : (
                        <div className="text-center py-2 text-sm text-[#666666]">No communities created yet</div>
                      )}
                    </div>
                  </div>
                )}

                {/* ✅ Updated: RECENT COMMUNITY for Mobile (Empty for now) */}
                <div>
                  <h4 className="text-xs font-semibold text-[#999999] mb-3 uppercase tracking-wide">
                    RECENT COMMUNITY
                  </h4>
                  <div className="space-y-2">
                    <div className="text-center py-4">
                      <p className="text-sm text-[#666666]">No recent communities</p>
                      <p className="text-xs text-[#999] mt-1">Communities you visit will appear here</p>
                    </div>
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
        </>
      )}

      {/* Modal Overlay for CreateCommunity */}
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