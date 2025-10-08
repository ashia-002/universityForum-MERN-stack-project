import React from 'react';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-[#FAF9FF] ml-0 lg:ml-[310px] mt-[118px] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#180F57] mb-3">Welcome to DATA DROP</h1>
          <p className="text-xl text-[#666666]">University Forum - Connect, Share, and Engage with your campus community</p>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-[0px_4px_12px_rgba(0,0,0,0.1)] border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-[#333333] mb-2">Active Communities</h3>
                <p className="text-3xl font-bold text-[#533DDE]">24</p>
              </div>
              <div className="w-12 h-12 bg-[#ECE9FB] rounded-lg flex items-center justify-center">
                <span className="text-2xl text-[#533DDE]">👥</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-[0px_4px_12px_rgba(0,0,0,0.1)] border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-[#333333] mb-2">Upcoming Events</h3>
                <p className="text-3xl font-bold text-[#533DDE]">12</p>
              </div>
              <div className="w-12 h-12 bg-[#ECE9FB] rounded-lg flex items-center justify-center">
                <span className="text-2xl text-[#533DDE]">📅</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-[0px_4px_12px_rgba(0,0,0,0.1)] border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-[#333333] mb-2">New Posts</h3>
                <p className="text-3xl font-bold text-[#533DDE]">156</p>
              </div>
              <div className="w-12 h-12 bg-[#ECE9FB] rounded-lg flex items-center justify-center">
                <span className="text-2xl text-[#533DDE]">💬</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-[0px_4px_12px_rgba(0,0,0,0.1)] border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-[#333333] mb-2">Online Users</h3>
                <p className="text-3xl font-bold text-[#533DDE]">89</p>
              </div>
              <div className="w-12 h-12 bg-[#ECE9FB] rounded-lg flex items-center justify-center">
                <span className="text-2xl text-[#533DDE]">🟢</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - 2/3 width */}
          <div className="lg:col-span-2 space-y-6">
            {/* Welcome Card */}
            <div className="bg-white rounded-2xl p-8 shadow-[0px_4px_12px_rgba(0,0,0,0.1)] border border-gray-100">
              <h2 className="text-2xl font-bold text-[#180F57] mb-4">Dashboard Overview</h2>
              <p className="text-[#666666] leading-relaxed text-lg mb-6">
                Welcome to your university forum dashboard. This is your central hub for connecting with 
                students, faculty, and various communities across the campus.
              </p>
              
              <div className="bg-[#FAF9FF] rounded-xl p-6 border border-[#ECE9FB]">
                <h3 className="text-lg font-semibold text-[#533DDE] mb-3">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button className="flex items-center space-x-3 p-4 rounded-lg bg-white border border-gray-200 hover:border-[#533DDE] transition-colors">
                    <span className="text-2xl">📝</span>
                    <span className="text-left">
                      <div className="font-semibold text-[#333333]">Create Post</div>
                      <div className="text-sm text-[#666666]">Share your thoughts</div>
                    </span>
                  </button>
                  <button className="flex items-center space-x-3 p-4 rounded-lg bg-white border border-gray-200 hover:border-[#533DDE] transition-colors">
                    <span className="text-2xl">🔍</span>
                    <span className="text-left">
                      <div className="font-semibold text-[#333333]">Explore</div>
                      <div className="text-sm text-[#666666]">Find communities</div>
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Recent Activity Placeholder */}
            <div className="bg-white rounded-2xl p-8 shadow-[0px_4px_12px_rgba(0,0,0,0.1)] border border-gray-100">
              <h2 className="text-2xl font-bold text-[#180F57] mb-6">Recent Activity</h2>
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📊</div>
                <p className="text-[#666666] text-lg mb-2">Your activity feed is empty</p>
                <p className="text-[#999999]">Start engaging with communities to see activity here</p>
              </div>
            </div>
          </div>

          {/* Right Column - 1/3 width */}
          <div className="space-y-6">
            {/* Quick Links */}
            <div className="bg-white rounded-2xl p-6 shadow-[0px_4px_12px_rgba(0,0,0,0.1)] border border-gray-100">
              <h3 className="text-lg font-bold text-[#180F57] mb-4">Quick Links</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-[#FAF9FF] transition-colors text-left">
                  <span className="text-xl">📚</span>
                  <span className="font-medium text-[#333333]">Academic Resources</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-[#FAF9FF] transition-colors text-left">
                  <span className="text-xl">🏛️</span>
                  <span className="font-medium text-[#333333]">University Events</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-[#FAF9FF] transition-colors text-left">
                  <span className="text-xl">💼</span>
                  <span className="font-medium text-[#333333]">Career Services</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-[#FAF9FF] transition-colors text-left">
                  <span className="text-xl">🆘</span>
                  <span className="font-medium text-[#333333]">Student Support</span>
                </button>
              </div>
            </div>

            {/* Announcements */}
            <div className="bg-white rounded-2xl p-6 shadow-[0px_4px_12px_rgba(0,0,0,0.1)] border border-gray-100">
              <h3 className="text-lg font-bold text-[#180F57] mb-4">Announcements</h3>
              <div className="space-y-4">
                <div className="p-3 bg-[#FAF9FF] rounded-lg border border-[#ECE9FB]">
                  <div className="font-semibold text-[#333333] mb-1">Spring Semester Starts</div>
                  <div className="text-sm text-[#666666]">January 15, 2024</div>
                </div>
                <div className="p-3 bg-[#FAF9FF] rounded-lg border border-[#ECE9FB]">
                  <div className="font-semibold text-[#333333] mb-1">Library Extended Hours</div>
                  <div className="text-sm text-[#666666]">Effective immediately</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;