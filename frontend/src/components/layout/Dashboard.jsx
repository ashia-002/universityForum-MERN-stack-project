import React, { useState, useEffect } from 'react';
import CreatePost from './CreatePost';
import Postcard from './Postcard';
import api from '../../services/api'; // ✅ Make sure this path is correct
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime); // to use dayjs(post.createdAt).fromNow()

const Dashboard = () => {
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [activeButton, setActiveButton] = useState('Recent');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔁 Fetch posts on mount
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await api.get('/post/all-posts');
        setPosts(response.data.posts || []);
      } catch (error) {
        console.error('Failed to fetch posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen bg-[#FAF9FF] font-poppins">
      <div
        className={`ml-80 pt-32 px-8 flex gap-8 transition-all duration-300 ${
          showCreatePost ? 'blur-sm pointer-events-none select-none' : ''
        }`}
      >
        {/* Left Column */}
        <div className="flex-1 flex flex-col gap-4">
          {/* Add Post Section */}
          <div className="flex justify-between items-center bg-white rounded-2xl p-6 shadow-[0px_4px_20px_rgba(100,81,225,0.15)]">
            <h1 className="text-xl font-semibold text-[#333333]">Add a new post</h1>
            <button
              onClick={() => setShowCreatePost(true)}
              className="w-12 h-12 bg-[#533DDE] text-white rounded-xl font-medium hover:bg-[#311EAE] transition-colors flex items-center justify-center text-2xl"
            >
              +
            </button>
          </div>

          {/* Filter Buttons */}
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

          {/* Posts List */}
          <div className="flex flex-col gap-4">
            {loading ? (
              <p className="text-center text-gray-500">Loading posts...</p>
            ) : posts.length === 0 ? (
              <p className="text-center text-gray-500">No posts found.</p>
            ) : (
              posts.map((post) => (
                <Postcard
                  key={post._id}
                  id={post._id}
                  title={post.title}
                  content={post.description}
                  author={post.created_by}
                  timeAgo={dayjs(post.createdAt).fromNow()}
                  tags={["Post", post.scope, post.department_id]} // Replace with dynamic if needed
                  comments={post.comments}
                />
              ))
            )}
          </div>
        </div>

        {/* Right Sidebar Placeholder */}
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
