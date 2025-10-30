import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../../assets/logo.jpg';

const NavbarAdmin = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: 'Notifications', icon: '🔔', path: '/admin/notifications' },
    { label: 'Total Users', icon: '👥', path: '/admin/users' },
    { label: 'Banned History', icon: '🚫', path: '/admin/banned' },
    { label: 'Approved', icon: '✅', path: '/admin/approved' },
    { label: 'Feedback', icon: '💬', path: '/admin/feedback' },
  ];

  const isActivePath = (path) => location.pathname === path;

  const handleLogout = () => {
    console.log('Admin logged out');
    navigate('/admin/login');
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
            <p className="text-[#666666] text-lg">Admin Panel</p>
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
          <button
            onClick={handleLogout}
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-[#FAF9FF] transition-colors border border-[#533DDE] shadow-sm"
          >
            <span className="text-[#533DDE] text-lg">🚪</span>
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <div className="fixed top-[118px] left-0 w-[310px] h-[433px] bg-white border-r border-[#D8D3F8] flex flex-col items-end p-[20px_25px] gap-[40px] z-40">
        <div className="flex flex-col items-start w-[260px] gap-8">
          <h3 className="text-[#666666] font-normal text-sm tracking-wide">OVERVIEW</h3>

          <div className="flex flex-col gap-4 w-full">
            {navItems.map((item, index) => (
              <button
                key={index}
                onClick={() => navigate(item.path)}
                className={`relative flex items-center gap-4 w-full px-[44px] py-4 rounded-lg transition-all ${
                  isActivePath(item.path)
                    ? 'bg-white border-r-4 border-[#6451E1] shadow-lg'
                    : 'bg-transparent hover:bg-gray-50'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span
                  className={`text-base font-normal ${
                    isActivePath(item.path) ? 'text-[#333333]' : 'text-[#666666]'
                  }`}
                >
                  {item.label}
                </span>
              </button>
            ))}
          </div>

          <div className="mt-auto w-full">
            <button
              onClick={handleLogout}
              className="flex items-center gap-4 w-full px-[44px] py-4 rounded-lg hover:bg-gray-50 text-[#666666] transition-colors"
            >
              <span className="text-xl">🚪</span>
              <span className="text-base font-normal">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default NavbarAdmin;
