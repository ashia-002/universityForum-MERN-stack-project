import React, { useState, useEffect } from "react";
import api from "../../services/api.js";

const CreatePost = ({ onClose, onAddPost }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    department_id: "",
    community_id: "",
    image: "",
  });
  const [loading, setLoading] = useState(false);
  const [userCommunities, setUserCommunities] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loadingCommunities, setLoadingCommunities] = useState(false);
  const [loadingDepartments, setLoadingDepartments] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);

  // Fetch current user ID, communities, and departments when component mounts
  useEffect(() => {
    const fetchUserDataAndCommunities = async () => {
      try {
        setLoadingCommunities(true);
        setLoadingDepartments(true);
        console.log("Fetching user data and communities...");

        // First, get current user info to know their ID
        let userId = null;
        try {
          const userResponse = await api.get("/user/profile");
          console.log("User profile response:", userResponse.data);
          userId = userResponse.data.user?._id || userResponse.data._id;
          setCurrentUserId(userId);
          console.log("Current user ID:", userId);
        } catch (userError) {
          console.log("Failed to get user profile:", userError.response?.data || userError.message);
        }

        // Fetch departments
        console.log("Fetching departments from /get/department");
        try {
          const deptResponse = await api.get("/get/department");
          console.log("Departments response:", deptResponse.data);
          setDepartments(deptResponse.data || []);
        } catch (deptError) {
          console.error("Error fetching departments:", deptError);
          console.error("Department error response:", deptError.response?.data);
        } finally {
          setLoadingDepartments(false);
        }

        // Now fetch all communities
        console.log("Fetching all communities from /community/view-all");
        const communitiesResponse = await api.get("/community/view-all");
        console.log("All communities response:", communitiesResponse.data);

        let allCommunities = [];
        
        // Handle different response structures
        if (Array.isArray(communitiesResponse.data)) {
          allCommunities = communitiesResponse.data;
        } else if (communitiesResponse.data.communities && Array.isArray(communitiesResponse.data.communities)) {
          allCommunities = communitiesResponse.data.communities;
        } else if (communitiesResponse.data.data && Array.isArray(communitiesResponse.data.data)) {
          allCommunities = communitiesResponse.data.data;
        }

        console.log("Total communities found:", allCommunities.length);
        console.log("All communities:", allCommunities);

        // Filter communities created by current user
        let userCreatedCommunities = [];
        if (userId && allCommunities.length > 0) {
          userCreatedCommunities = allCommunities.filter(community => {
            const createdById = community.created_by?._id || community.created_by;
            const isCreatedByUser = createdById === userId;
            
            if (isCreatedByUser) {
              console.log(`Community "${community.name}" created by user`);
            }
            
            return isCreatedByUser;
          });
        }

        console.log("User created communities:", userCreatedCommunities);
        setUserCommunities(userCreatedCommunities);

      } catch (error) {
        console.error("Error fetching communities:", error);
        console.error("Error response:", error.response?.data);
        setUserCommunities([]);
      } finally {
        setLoadingCommunities(false);
      }
    };

    fetchUserDataAndCommunities();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.department_id) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        title: formData.title,
        description: formData.description,
        scope: "university",
        community_id: formData.community_id || null,
        department_id: formData.department_id,
        image: formData.image || "", // Use the URL directly from form data
      };

      const response = await api.post("/post/create", payload);

      alert("Post created successfully!");

      // ✅ Add the new post to Dashboard immediately
      if (onAddPost) {
        onAddPost(response.data.post || response.data); // use returned post object
      }

      onClose();
    } catch (error) {
      console.error("❌ Post creation error:", error);
      alert(error.response?.data?.msg || "Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-10 bg-white rounded-3xl shadow-xl font-poppins">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-semibold text-[#2C2C2C]">Create Post</h2>
        <button
          onClick={onClose}
          className="text-[#666] hover:text-[#2C2C2C] transition-colors"
        >
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-base font-medium text-[#555] mb-2">Title</label>
          <input
            type="text"
            name="title"
            placeholder="Enter post title"
            value={formData.title}
            onChange={handleChange}
            className="w-full h-14 bg-[#F8F9FF] border border-[#E3E0F9] rounded-xl px-4 outline-none focus:ring-2 focus:ring-[#533DDE] text-[#333]"
            required
          />
        </div>

        <div>
          <label className="block text-base font-medium text-[#555] mb-2">Description</label>
          <textarea
            name="description"
            placeholder="Write your post details..."
            value={formData.description}
            onChange={handleChange}
            rows="4"
            className="w-full bg-[#F8F9FF] border border-[#E3E0F9] rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#533DDE] text-[#333] resize-none"
            required
          />
        </div>

        <div className="flex items-center gap-4">
          <select
            name="department_id"
            value={formData.department_id}
            onChange={handleChange}
            className="w-36 h-14 bg-[#F8F9FF] border border-[#E3E0F9] rounded-xl px-4 outline-none focus:ring-2 focus:ring-[#533DDE] text-[#533DDE] font-medium"
            required
            disabled={loadingDepartments}
          >
            <option value="">Department</option>
            {loadingDepartments ? (
              <option value="" disabled>Loading departments...</option>
            ) : departments.length > 0 ? (
              departments.map((dept) => (
                <option key={dept._id} value={dept._id}>
                  {dept.name}
                </option>
              ))
            ) : (
              <option value="" disabled>No departments available</option>
            )}
          </select>

          <select
            name="community_id"
            value={formData.community_id}
            onChange={handleChange}
            className="w-36 h-14 bg-[#F8F9FF] border border-[#E3E0F9] rounded-xl px-4 outline-none focus:ring-2 focus:ring-[#533DDE] text-[#533DDE] font-medium"
            disabled={loadingCommunities}
          >
            <option value="">Community</option>
            {loadingCommunities ? (
              <option value="" disabled>Loading your communities...</option>
            ) : userCommunities.length > 0 ? (
              userCommunities.map((community) => (
                <option key={community._id} value={community._id}>
                  {community.name}
                </option>
              ))
            ) : (
              <option value="" disabled>No communities created</option>
            )}
          </select>
        </div>

        {userCommunities.length > 0 && (
          <div className="text-sm text-[#533DDE]">
            Showing {userCommunities.length} of your communities
          </div>
        )}

        <div>
          <label className="block text-base font-medium text-[#555] mb-2">Image URL (optional)</label>
          <input
            type="url"
            name="image"
            placeholder="https://example.com/image.jpg"
            value={formData.image}
            onChange={handleChange}
            className="w-full h-14 bg-[#F8F9FF] border border-[#E3E0F9] rounded-xl px-4 outline-none focus:ring-2 focus:ring-[#533DDE] text-[#333]"
          />
          <p className="text-sm text-gray-500 mt-1">
            Enter a direct URL to your image (supports JPG, PNG, GIF, etc.)
          </p>
        </div>

        {/* Image Preview */}
        {formData.image && (
          <div className="mt-2">
            <p className="text-sm font-medium text-[#555] mb-2">Image Preview:</p>
            <div className="border border-[#E3E0F9] rounded-lg p-2 bg-[#F8F9FF]">
              <img 
                src={formData.image} 
                alt="Preview" 
                className="max-h-40 mx-auto rounded"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
          </div>
        )}

        <div className="border-t border-[#ECE9FB] my-6"></div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-8 py-3 bg-[#ECE9FB] text-[#533DDE] rounded-xl font-medium hover:bg-[#E0DCF9] transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 bg-[#533DDE] text-white rounded-xl font-medium hover:bg-[#311EAE] transition-colors min-w-[130px] disabled:opacity-50"
          >
            {loading ? "Publishing..." : "Publish"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;