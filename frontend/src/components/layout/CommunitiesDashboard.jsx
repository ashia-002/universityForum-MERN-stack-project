import React, { useState, useEffect } from "react";
import api from "../../services/api";

const CommunitiesDashboard = () => {
  const categories = [
    "All",
    "Cultural",
    "Academic",
    "Register",
    "Library",
    "Admission",
    "Department",
  ];

  const [activeCategory, setActiveCategory] = useState("All");
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        setLoading(true);
        setError("");
        
        const response = await api.get("/community/view-all");
        
        // Extract communities from the response structure
        const communitiesData = response.data.communities || [];
        
        // Map the API response to match our component structure
        const mappedCommunities = communitiesData.map((community, index) => ({
          id: community._id || community.id || `community-${index}`,
          name: community.name || "Unnamed Community",
          description: community.description || "No description available",
          members: Array.isArray(community.members) ? community.members.length : community.members_count || 0,
          banner_image: community.banner_image,
          icon_image: community.icon_image,
          created_by: community.created_by,
          visibility: community.visibility || "public",
          createdAt: community.createdAt || new Date().toISOString(),
          // Check if current user is the creator or a member
          joined: checkIfUserJoined(community),
          isCreator: checkIfUserIsCreator(community)
        }));
        
        // ✅ Filter: Only show communities the user has joined (excluding ones they created)
        const joinedCommunities = mappedCommunities.filter(community => 
          community.joined && !community.isCreator
        );
        
        setCommunities(joinedCommunities);
      } catch (err) {
        console.error("Failed to fetch communities:", err);
        setError(err.response?.data?.msg || err.message || "Failed to load communities");
      } finally {
        setLoading(false);
      }
    };

    fetchCommunities();
  }, []);

  // Helper function to check if current user joined the community
  const checkIfUserJoined = (community) => {
    const currentUserId = getCurrentUserId();
    if (!currentUserId) return false;
    
    if (Array.isArray(community.members)) {
      return community.members.some(member => {
        if (typeof member === 'object') {
          return member._id === currentUserId || member.id === currentUserId;
        }
        return member === currentUserId;
      });
    }
    return false;
  };

  // Helper function to check if current user is the creator
  const checkIfUserIsCreator = (community) => {
    const currentUserId = getCurrentUserId();
    if (!currentUserId || !community.created_by) return false;
    
    if (typeof community.created_by === 'object') {
      return community.created_by._id === currentUserId || community.created_by.id === currentUserId;
    }
    return community.created_by === currentUserId;
  };

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

  // Filter communities based on active category
  const filteredCommunities = activeCategory === "All" 
    ? communities 
    : communities.filter(community => 
        community.name.toLowerCase().includes(activeCategory.toLowerCase()) ||
        community.description.toLowerCase().includes(activeCategory.toLowerCase())
      );

  // Handle join/leave community
  const handleJoinCommunity = async (communityId, currentStatus) => {
    try {
      if (currentStatus) {
        await api.post(`/community/${communityId}/leave`);
      } else {
        await api.post(`/community/${communityId}/join`);
      }
      
      // Update local state
      setCommunities(prevCommunities => 
        prevCommunities.map(community => 
          community.id === communityId 
            ? { ...community, joined: !currentStatus }
            : community
        )
      );
    } catch (err) {
      console.error("Failed to update community membership:", err);
      alert(err.response?.data?.msg || "Failed to update community");
    }
  };

  // Format member count
  const formatMemberCount = (count) => {
    return `${count} member${count !== 1 ? 's' : ''}`;
  };

  // Format date
  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (e) {
      return "Unknown date";
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9FF] font-poppins">
      <div
        className={`pt-32 px-4 sm:px-6 md:px-8 lg:px-10 flex flex-col gap-6 transition-all duration-300 ${
          window.innerWidth >= 1024 ? "ml-80" : ""
        }`}
      >
        {/* ✅ Updated Title */}
        <h1 className="text-3xl font-extrabold text-[#180F57] mb-6">
          Joined Communities
        </h1>

        {/* Category Buttons */}
        <div className="flex flex-wrap gap-4 mb-6">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-2 rounded-md text-[16px] font-medium border transition-all duration-200
                ${
                  activeCategory === category
                    ? "bg-[#5E43F3] text-white border-[#5E43F3]"
                    : "bg-[#ECE6FF] text-[#5E43F3] border-[#D6CCFF] hover:bg-[#D6CCFF]"
                }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-10">
            <div className="text-[#533DDE] text-lg">Loading communities...</div>
          </div>
        )}

        {/* Communities Grid */}
        {!loading && !error && (
          <>
            {/* ✅ Updated Results Count */}
            <div className="text-sm text-[#666666] mb-4">
              Showing {filteredCommunities.length} joined communit{filteredCommunities.length !== 1 ? 'ies' : 'y'}
              {activeCategory !== 'All' && ` in ${activeCategory}`}
            </div>

            {/* Grid of Communities */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-10">
              {filteredCommunities.length > 0 ? (
                filteredCommunities.map((community) => (
                  <div
                    key={community.id}
                    className="bg-white rounded-xl border border-[#E6E6E6] shadow-md p-5 flex flex-col justify-between hover:shadow-lg transition-all duration-300"
                  >
                    {/* Community Header */}
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h2 className="text-lg font-semibold text-[#180F57] mb-1">
                          {community.name}
                        </h2>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                          <span>{formatMemberCount(community.members)}</span>
                          <span>•</span>
                          <span className="capitalize">{community.visibility}</span>
                          <span>•</span>
                          <span className="text-green-600 font-medium">Member</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleJoinCommunity(community.id, community.joined)}
                        className={`px-4 py-1 border rounded-lg text-sm font-medium transition-colors ${
                          community.joined
                            ? "border-[#9C89FF] text-[#5E43F3] bg-[#F8F6FF] hover:bg-[#ECE9FB]"
                            : "border-[#D9D9D9] text-gray-600 hover:border-[#5E43F3] hover:text-[#5E43F3] hover:bg-[#F8F6FF]"
                        }`}
                      >
                        {community.joined ? "Leave" : "Join"}
                      </button>
                    </div>

                    {/* Community Description */}
                    <p className="text-gray-700 text-sm leading-snug mb-4 line-clamp-3">
                      {community.description}
                    </p>

                    {/* Community Images Preview */}
                    {(community.banner_image || community.icon_image) && (
                      <div className="flex gap-2 mb-4">
                        {community.banner_image && (
                          <div className="flex-1 h-16 bg-gray-100 rounded-lg overflow-hidden">
                            <img 
                              src={community.banner_image} 
                              alt={`${community.name} banner`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.style.display = 'none';
                              }}
                            />
                          </div>
                        )}
                        {community.icon_image && (
                          <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                            <img 
                              src={community.icon_image} 
                              alt={`${community.name} icon`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.style.display = 'none';
                              }}
                            />
                          </div>
                        )}
                      </div>
                    )}

                    {/* Community Footer */}
                    <div className="flex justify-between items-center text-xs text-gray-500 border-t pt-3">
                      <span>Created {formatDate(community.createdAt)}</span>
                      {community.created_by && typeof community.created_by === 'object' && (
                        <span>By {community.created_by.name || 'Unknown'}</span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-10">
                  <div className="text-gray-500 text-lg mb-2">
                    No joined communities found
                  </div>
                  <p className="text-gray-400 text-sm">
                    {activeCategory === 'All' 
                      ? "You haven't joined any communities yet. Explore and join some!"
                      : `No joined communities found in ${activeCategory} category.`
                    }
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CommunitiesDashboard;