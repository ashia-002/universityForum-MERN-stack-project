// src/components/layout/ViewCommunity.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";
import CreatePost from "./CreatePost"; // Import the CreatePost component
import PostCard from "./Postcard"; // Import the PostCard component

const ViewCommunity = () => {
  const { communityId } = useParams();
  const [community, setCommunity] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreatePostModal, setShowCreatePostModal] = useState(false);

  useEffect(() => {
    const fetchCommunityData = async () => {
      try {
        setLoading(true);
        setError("");
        
        // Fetch community details using the correct endpoint
        const communityResponse = await api.get(`/community/view/${communityId}`);
        setCommunity(communityResponse.data.community);

        // Try to fetch community posts - use mock data if endpoint doesn't exist
        let postsData = [];
        try {
          // You might need to adjust this endpoint based on your backend
          const postsResponse = await api.get(`/community/${communityId}/posts`);
          postsData = postsResponse.data.posts || postsResponse.data || [];
        } catch (postsErr) {
          console.log("Posts endpoint not available, using mock data");
          // Use mock posts data that matches your reference image
          postsData = [
            {
              id: "1",
              title: "Date of the final exams",
              content: "Hand rib pepperoni thin and rib steak ranch. Pork banana rib cheese sautéed olives buffalo deep pork bell. And marinara cheese melted red mozzarella crust ham cheese olives. Aussie ham ipsum pie wing. Deep marinara mayo broccoli meatball burnt marinara. Fresh pineapple olives Hawaiian onions ricotta meat party green.",
              author: { 
                name: "Dr Ronald Jackson", 
                role: "Teacher",
                avatar: "/default-avatar.png"
              },
              timeAgo: "3d ago",
              tags: ["Post", "Department", "CSE"],
              comments: []
            },
            {
              id: "2",
              title: "Photography Contest",
              content: "Join our annual photography contest and showcase your talent! Prizes include professional camera equipment and featured spots in the university gallery.",
              author: { 
                name: "Dr Ronald Jackson", 
                role: "Student, Admin",
                avatar: "/default-avatar.png"
              },
              timeAgo: "3d ago",
              tags: ["Post", "Department", "CSE"],
              comments: []
            }
          ];
        }

        // Transform posts to match PostCard structure
        const transformedPosts = postsData.map(post => ({
          id: post.id || post._id,
          title: post.title,
          content: post.content || post.description,
          author: post.author || { name: "Unknown", avatar: "/default-avatar.png", role: "User" },
          timeAgo: post.timeAgo || formatTimeAgo(post.createdAt),
          tags: post.tags || ["Post", "Department", "CSE"],
          comments: post.comments || [],
          showCommentButton: true
        }));

        setPosts(transformedPosts);

      } catch (err) {
        console.error("Failed to fetch community data:", err);
        setError(err.response?.data?.msg || err.message || "Failed to load community");
      } finally {
        setLoading(false);
      }
    };

    if (communityId) {
      fetchCommunityData();
    }
  }, [communityId]);

  // Format time ago
  const formatTimeAgo = (dateString) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
      
      if (diffInHours < 1) return "Just now";
      if (diffInHours < 24) return `${diffInHours}h ago`;
      if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
      return `${Math.floor(diffInHours / 168)}w ago`;
    } catch (e) {
      return "Unknown time";
    }
  };

  // Handle adding a new post to the community
  const handleAddPost = (newPost) => {
    // Transform the new post to match PostCard structure
    const transformedPost = {
      id: newPost._id || newPost.id,
      title: newPost.title,
      content: newPost.description,
      author: { 
        name: "You", // You might want to get the actual user name from context/localStorage
        role: "Member",
        avatar: "/default-avatar.png"
      },
      timeAgo: "Just now",
      tags: ["Post", "Department", newPost.department_id === "68e68902fe6bae63caea28c7" ? "CSE" : "Other"],
      comments: [],
      showCommentButton: true
    };

    setPosts(prevPosts => [transformedPost, ...prevPosts]);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF9FF] flex justify-center items-center">
        <div className="text-[#533DDE] text-lg">Loading community...</div>
      </div>
    );
  }

  if (error || !community) {
    return (
      <div className="min-h-screen bg-[#FAF9FF] flex justify-center items-center">
        <div className="text-red-600 text-lg">
          {error || "Community not found"}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9FF] font-poppins">
      {/* Create Post Modal */}
      {showCreatePostModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="max-w-2xl w-full">
            <CreatePost 
              onClose={() => setShowCreatePostModal(false)}
              onAddPost={handleAddPost}
            />
          </div>
        </div>
      )}

      <div
        className={`pt-32 px-4 sm:px-6 md:px-8 lg:px-10 flex gap-6 transition-all duration-300 ${
          window.innerWidth >= 1024 ? "ml-80" : ""
        }`}
      >
        {/* Main Content */}
        <div className="flex-1">
          {/* Community Header */}
          <div className="bg-white rounded-xl border border-[#E6E6E6] shadow-sm p-6 mb-6">
            <div className="flex items-center gap-4 mb-4">
              {community.icon_image && (
                <img 
                  src={community.icon_image} 
                  alt={community.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
              )}
              <div>
                <h1 className="text-2xl font-bold text-[#180F57]">
                  {community.name}
                </h1>
                <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                  <span>{community.member_count || 0} member{community.member_count !== 1 ? 's' : ''}</span>
                  <span>•</span>
                  <span>1 online</span>
                </div>
              </div>
            </div>

            {/* Department Section */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-[#180F57] mb-3">
                Department
              </h2>
              <div className="flex items-center justify-between text-sm text-[#5E43F3] font-medium">
                <span>Recent Top</span>
                <span className="text-gray-400">---</span>
              </div>
            </div>

            {/* Posts Section using PostCard */}
            <div className="space-y-6">
              {posts.length > 0 ? (
                posts.map((post) => (
                  <PostCard
                    key={post.id}
                    id={post.id}
                    title={post.title}
                    author={post.author}
                    timeAgo={post.timeAgo}
                    tags={post.tags}
                    content={post.content}
                    comments={post.comments}
                    showCommentButton={post.showCommentButton}
                  />
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No posts yet in this community. Be the first to create one!
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-80 flex-shrink-0 hidden lg:block">
          <div className="bg-white rounded-xl border border-[#E6E6E6] shadow-sm p-6 sticky top-32">
            {/* Community Info */}
            <div className="mb-6">
              <h2 className="text-xl font-bold text-[#180F57] mb-2">
                {community.name}
              </h2>
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                <span>{community.member_count || 0} member{community.member_count !== 1 ? 's' : ''}</span>
                <span>•</span>
                <span className="text-green-600 font-medium">1 online</span>
              </div>
            </div>

            {/* About Us */}
            <div>
              <h3 className="text-lg font-semibold text-[#180F57] mb-3">
                ABOUT US
              </h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                {community.description || "No description available for this community."}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 space-y-3">
              <button 
                onClick={() => setShowCreatePostModal(true)}
                className="w-full bg-[#5E43F3] text-white py-2 px-4 rounded-lg font-medium hover:bg-[#4A36C7] transition-colors"
              >
                Create Post
              </button>
              <button className="w-full border border-[#5E43F3] text-[#5E43F3] py-2 px-4 rounded-lg font-medium hover:bg-[#F8F6FF] transition-colors">
                Invite Members
              </button>
            </div>

            {/* Members Preview */}
            {community.member_count > 0 && (
              <div className="mt-6">
                <h4 className="text-sm font-semibold text-[#180F57] mb-3">
                  Members ({community.member_count})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {/* Mock member avatars - you might want to fetch actual members later */}
                  {Array.from({ length: Math.min(community.member_count, 6) }).map((_, index) => (
                    <div key={index} className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-xs font-medium text-gray-600">
                      {String.fromCharCode(65 + index)}
                    </div>
                  ))}
                  {community.member_count > 6 && (
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-xs font-medium text-gray-500">
                      +{community.member_count - 6}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewCommunity;