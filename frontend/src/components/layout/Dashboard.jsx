// src/components/layout/Dashboard.jsx
import React, { useState, useEffect } from "react";
import CreatePost from "./CreatePost";
import Postcard from "./Postcard";
import api from "../../services/api";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

const Dashboard = () => {
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [activeButton, setActiveButton] = useState("Recent");
  const [posts, setPosts] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedDept, setSelectedDept] = useState("");
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    postId: null,
    postTitle: ""
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postsRes, deptRes] = await Promise.all([
          api.get("/post/all-posts"),
          api.get("/get/department"),
        ]);
        setPosts(postsRes.data.posts || []);
        setDepartments(deptRes.data || []);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, []);

  const getDepartmentName = (id) => {
    const dept = departments.find((d) => d._id === id);
    return dept ? dept.name : "Unknown Department";
  };

  // Handle post deletion
  const handleDeletePost = (deletedPostId) => {
    setPosts(prevPosts => prevPosts.filter(post => post._id !== deletedPostId));
    setDeleteModal({ isOpen: false, postId: null, postTitle: "" });
  };

  // Open delete confirmation modal
  const openDeleteModal = (postId, postTitle) => {
    setDeleteModal({
      isOpen: true,
      postId,
      postTitle
    });
  };

  // Close delete confirmation modal
  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, postId: null, postTitle: "" });
  };

  // Handle post editing (placeholder for now)
  const handleEditPost = (postId) => {
    console.log("Edit post:", postId);
    // TODO: Implement edit modal or functionality
   
  };

  // Filter & sort posts
  const filteredPosts = posts
    .filter((post) =>
      selectedDept ? post.department_id === selectedDept : true
    )
    .sort((a, b) => {
      if (activeButton === "Recent") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else if (activeButton === "Top") {
        return (b.comments?.length || 0) - (a.comments?.length || 0);
      }
      return 0;
    });

  return (
    <div className="min-h-screen bg-[#FAF9FF] font-poppins">
      <div
        className={`pt-32 px-4 sm:px-6 md:px-8 lg:px-10 flex flex-col lg:flex-row gap-6 transition-all duration-300 ${
          showCreatePost ? "blur-sm pointer-events-none select-none" : ""
        } ${window.innerWidth >= 1024 ? "ml-80" : ""}`}
      >
        <div className="flex-1 flex flex-col gap-4">
          {/* Add Post */}
          <div className="flex justify-between items-center bg-white rounded-2xl p-4 sm:p-6 shadow-[0px_4px_20px_rgba(100,81,225,0.15)]">
            <h1 className="text-lg sm:text-xl font-semibold text-[#333333]">
              Add a new post
            </h1>
            <button
              onClick={() => setShowCreatePost(true)}
              className="w-10 h-10 sm:w-12 sm:h-12 bg-[#533DDE] text-white rounded-xl font-medium hover:bg-[#311EAE] transition-colors flex items-center justify-center text-xl sm:text-2xl"
            >
              +
            </button>
          </div>

          {/* Filter & Sort */}
          <div className="flex flex-wrap gap-4 items-center">
            <div className="relative w-full sm:w-44">
              <select
                className="appearance-none w-full h-12 sm:h-14 bg-white border border-[#ECE9FB] rounded-xl pl-4 pr-10 outline-none text-[#666666] text-sm font-normal focus:ring-2 focus:ring-[#533DDE] focus:border-transparent cursor-pointer"
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
              >
                <option value="">All Departments</option>
                {departments.map((dept) => (
                  <option key={dept._id} value={dept._id}>
                    {dept.name}
                  </option>
                ))}
              </select>
              <svg
                className="absolute right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#533DDE] pointer-events-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            <button
              onClick={() => setActiveButton("Recent")}
              className={`w-28 sm:w-32 h-12 sm:h-14 rounded-xl font-medium transition-colors ${
                activeButton === "Recent"
                  ? "bg-[#533DDE] text-white"
                  : "bg-[#F8F9FF] text-[#533DDE] hover:bg-[#ECE9FB]"
              }`}
            >
              Recent
            </button>

            <button
              onClick={() => setActiveButton("Top")}
              className={`w-28 sm:w-32 h-12 sm:h-14 rounded-xl font-medium transition-colors ${
                activeButton === "Top"
                  ? "bg-[#533DDE] text-white"
                  : "bg-[#F8F9FF] text-[#533DDE] hover:bg-[#ECE9FB]"
              }`}
            >
              Top
            </button>
          </div>

          {/* Render Posts */}
          <div className="flex flex-col gap-4">
            {filteredPosts.map((post) => (
              <Postcard
                key={post._id}
                id={post._id}
                title={post.title}
                content={post.description}
                author={post.created_by?.name || "Unknown"}
                role={post.created_by?.role || ""}
                timeAgo={`Posted ${dayjs(post.createdAt).fromNow()}`}
                tags={[
                  "Post",
                  post.scope,
                  getDepartmentName(post.department_id),
                ]}
                initialComments={post.comments}
                onDelete={() => openDeleteModal(post._id, post.title)} // ✅ Updated to open confirmation modal
                onEdit={handleEditPost} // ✅ Added edit handler
              />
            ))}
          </div>
        </div>

        <div className="hidden lg:block w-80 flex-shrink-0"></div>
      </div>

      {/* Create Post Modal */}
      {showCreatePost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-6xl">
            <CreatePost
              onClose={() => setShowCreatePost(false)}
              onAddPost={(newPost) => setPosts([newPost, ...posts])}
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md mx-auto p-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-[#333333] mb-2">
                Are you sure you want to delete this post?
              </h2>
              <p className="text-[#666666] mb-6">
                {deleteModal.postTitle && (
                  <span className="font-medium">"{deleteModal.postTitle}"</span>
                )}
                <br />
                Member posts will remain.
              </p>
              
              <div className="flex gap-4 justify-center">
                <button
                  onClick={closeDeleteModal}
                  className="px-6 py-3 bg-[#F8F9FF] text-[#533DDE] rounded-xl font-medium hover:bg-[#ECE9FB] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeletePost(deleteModal.postId)}
                  className="px-6 py-3 bg-[#533DDE] text-white rounded-xl font-medium hover:bg-[#311EAE] transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;