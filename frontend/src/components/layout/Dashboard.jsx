import React, { useState } from 'react';
import CreatePost from './CreatePost';
import Postcard from './Postcard'; // make sure file is exactly 'Postcard.jsx'

const Dashboard = () => {
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [activeButton, setActiveButton] = useState('Recent'); // default active

  return (
    <div className="min-h-screen bg-[#FAF9FF] font-poppins">
      
      {/* Main Content Area with blur when modal is open */}
      <div
        className={`ml-80 pt-32 px-8 flex gap-8 transition-all duration-300 ${
          showCreatePost ? 'blur-sm pointer-events-none select-none' : ''
        }`}
      >
        {/* Left/Main Column */}
        <div className="flex-1 flex flex-col gap-4">
          
          {/* Add a New Post Section */}
          <div className="flex justify-between items-center bg-white rounded-2xl p-6 shadow-[0px_4px_20px_rgba(100,81,225,0.15)]">
            <h1 className="text-xl font-semibold text-[#333333]">Add a new post</h1>
            <button
              onClick={() => setShowCreatePost(true)}
              className="w-12 h-12 bg-[#533DDE] text-white rounded-xl font-medium hover:bg-[#311EAE] transition-colors flex items-center justify-center text-2xl"
            >
              +
            </button>
          </div>

          {/* Buttons below Add a New Post */}
          <div className="flex gap-4 items-center">
            <div className="relative w-44">
              <select
                className="appearance-none w-full h-14 bg-white border border-[#ECE9FB] rounded-xl pl-4 pr-10 outline-none text-[#666666] text-sm font-normal focus:ring-2 focus:ring-[#533DDE] focus:border-transparent cursor-pointer"
                defaultValue=""
              >
                <option value="" disabled>
                  Department
                </option>
                <option value="cse">CSE</option>
                <option value="bba">BBA</option>
                <option value="ece">ECE</option>
              </select>
              <svg
                className="absolute right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#533DDE] pointer-events-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>

            <button
              onClick={() => setActiveButton('Recent')}
              className={`w-32 h-14 rounded-xl font-medium transition-colors ${
                activeButton === 'Recent'
                  ? 'bg-[#533DDE] text-white'
                  : 'bg-[#F8F9FF] text-[#533DDE] hover:bg-[#ECE9FB]'
              }`}
            >
              Recent
            </button>

            <button
              onClick={() => setActiveButton('Top')}
              className={`w-32 h-14 rounded-xl font-medium transition-colors ${
                activeButton === 'Top'
                  ? 'bg-[#533DDE] text-white'
                  : 'bg-[#F8F9FF] text-[#533DDE] hover:bg-[#ECE9FB]'
              }`}
            >
              Top
            </button>
          </div>

          {/* Post Cards Section */}
          <div className="flex flex-col gap-4">
            <Postcard
              title="Date of the final exams"
              author="Dr Ronald Jackson"
              timeAgo="3d ago"
              role="Teacher"
              tags={['Post', 'Department', 'CSE']}
              content="Hand rib pepperoni thin and rib steak ranch. Pork banana rib cheese sautéed olives buffalo deep pork bell. And marinara cheese melted red mozzarella crust ham cheese olives. Aussie ham ipsum pie wing. Deep marinara mayo broccoli meatball burnt marinara. Fresh pineapple olives Hawaiian onions ricotta meat party green."
            />

            <Postcard
              title="Photography Contest"
              author="Dr Ronald Jackson"
              timeAgo="3d ago"
              role="Student • Admin"
              tags={['Post', 'Community', 'CSE_Photography']}
              content="Join our annual photography contest showcasing the best campus moments. Submit your entries by Friday for a chance to win exciting prizes and get featured in the university magazine."
            />

            <Postcard
              title="Campus Library Hours Extended"
              author="University Administration"
              timeAgo="1d ago"
              role="Admin"
              tags={['Announcement', 'University', 'Library']}
              content="The main campus library will now remain open until 11 PM during weekdays to accommodate students' study needs during finals week. Additional study spaces have been arranged in the east wing."
            />

            <Postcard
              title="Programming Workshop Series"
              author="Prof. Sarah Wilson"
              timeAgo="2d ago"
              role="Faculty"
              tags={['Event', 'Workshop', 'CSE']}
              content="Join our weekly programming workshops covering advanced topics in web development, machine learning, and data structures. Perfect for students looking to enhance their coding skills and prepare for technical interviews."
              showCommentButton={true}
            />
          </div>
        </div>

        {/* Right Column (empty for future sidebar) */}
        <div className="w-80 flex-shrink-0">{/* Reserved for future sidebar */}</div>
      </div>

      {/* Create Post Modal */}
      {showCreatePost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-6xl">
            <CreatePost onClose={() => setShowCreatePost(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
