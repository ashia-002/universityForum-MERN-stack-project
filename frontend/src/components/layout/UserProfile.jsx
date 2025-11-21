// src/components/layout/UserProfile.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import PostCard from "./PostCard";
import api from "../../services/api";

const UserProfile = () => {
  const [activeFilter, setActiveFilter] = useState("Department");
  const [userPosts, setUserPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  
  const { user, isAuthenticated, loading: authLoading, logout } = useAuth();

  // Fetch user's posts
  useEffect(() => {
    const fetchUserPosts = async () => {
      if (!user?._id) return;
      
      try {
        setPostsLoading(true);
        
        // Try to get user-specific posts
        try {
          const response = await api.get("/posts/my-posts");
          setUserPosts(response.data.posts || response.data || []);
        } catch (error) {
          console.log("User posts endpoint not available, using fallback...");
          // Fallback to mock data
          const mockUserPosts = [
            {
              id: "1",
              title: "Welcome to Your Profile",
              author: { 
                name: user?.name || "User", 
                avatar: user?.avatar || "/default-avatar.png", 
                role: user?.role || "Student" 
              },
              timeAgo: "Just now",
              tags: ["Post", "Department", user?.department || "General"],
              content: "This is your personal space. Posts you create will appear here.",
              comments: [],
              showCommentButton: true
            }
          ];
          setUserPosts(mockUserPosts);
        }

      } catch (error) {
        console.error("Error fetching user posts:", error);
      } finally {
        setPostsLoading(false);
      }
    };

    if (isAuthenticated && user) {
      fetchUserPosts();
    }
  }, [user, isAuthenticated]);

  // Show loading state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-white font-poppins flex items-center justify-center">
        <div className="text-[#533DDE] text-lg">Loading profile...</div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white font-poppins flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl text-[#333333] mb-4">Please log in to view your profile</h2>
          <a 
            href="/login" 
            className="px-6 py-3 bg-[#533DDE] text-white rounded-lg hover:bg-[#311EAE] transition-colors"
          >
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-poppins">
      <div className={`pt-32 transition-all duration-300 ${window.innerWidth >= 1024 ? "ml-80" : ""}`}>
        
        {/* Main Container */}
        <div className="flex flex-col items-center px-6 gap-16 relative max-w-[1600px] mx-auto">
          
          {/* Teal Header Background */}
          <div className="w-full h-[290px] bg-[#ECF8F9] absolute top-0 left-0 right-0 z-0 rounded-b-2xl"></div>

          {/* Profile Header Section */}
          <div className="flex flex-row justify-between items-end p-0 gap-4 w-full h-[188px] relative z-10">
            
            {/* Left Profile Info */}
            <div className="flex flex-row items-end gap-4 w-[901px] h-[160px]">
              
              {/* Profile Picture */}
              <div className="flex flex-row items-center p-0 gap-6 w-[160px] h-[160px]">
                <div className="w-[160px] h-[160px] bg-gray-200 border-[3px] border-[#7FD696] rounded-lg">
                  {user?.avatar && (
                    <img 
                      src={user.avatar} 
                      alt={user.name} 
                      className="w-full h-full object-cover rounded-lg"
                    />
                  )}
                </div>
              </div>

              {/* Profile Text Info */}
              <div className="flex flex-col justify-center items-start p-0 gap-1 w-[725px] h-[64px]">
                <div className="flex flex-row justify-between items-center p-0 gap-1 w-[725px] h-[33px]">
                  <h1 className="text-[24px] font-bold leading-[36px] tracking-wide text-[#1A1A1A]">
                    {user?.name || "User"}
                  </h1>
                  <div className="flex justify-center items-center px-3 py-2 gap-2 w-auto h-[30px] bg-[#ECE9FB] border-2 border-[#8B7CE9] rounded-2xl">
                    <span className="text-[14px] font-medium leading-[21px] text-[#8B7CE9]">
                      {user?.department || "General"}
                    </span>
                  </div>
                </div>
                <p className="w-full text-[18px] font-medium leading-[27px] text-[#333333]">
                  {user?.role || "Member"}
                </p>
              </div>
            </div>

            {/* Right Button - Only Recent Activity */}
            <div className="flex flex-row items-center p-0 gap-4 w-auto h-[56px]">
              <button className="flex flex-row justify-center items-center px-5 gap-2 h-[56px] bg-[#533DDE] rounded-lg hover:bg-[#4530C9] transition-colors">
                <span className="text-[18px] font-medium leading-[27px] text-[#F2F2F2]">Recent Activity</span>
              </button>
            </div>

          </div>

          {/* Rest of your UserProfile component remains the same */}
          {/* ... */}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;