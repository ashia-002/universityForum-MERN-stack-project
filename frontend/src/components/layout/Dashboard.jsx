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

  // Fetch posts and departments
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

  // Map department ID to department name
  const getDepartmentName = (id) => {
    const dept = departments.find((d) => d._id === id);
    return dept ? dept.name : "Unknown Department";
  };

  return (
    <div className="min-h-screen bg-[#FAF9FF] font-poppins">
      <div
        className={`ml-80 pt-32 px-8 flex gap-8 transition-all duration-300 ${
          showCreatePost ? "blur-sm pointer-events-none select-none" : ""
        }`}
      >
        {/* Main Content */}
        <div className="flex-1 flex flex-col gap-4">
          {/* Add Post */}
          <div className="flex justify-between items-center bg-white rounded-2xl p-6 shadow-[0px_4px_20px_rgba(100,81,225,0.15)]">
            <h1 className="text-xl font-semibold text-[#333333]">
              Add a new post
            </h1>
            <button
              onClick={() => setShowCreatePost(true)}
              className="w-12 h-12 bg-[#533DDE] text-white rounded-xl font-medium hover:bg-[#311EAE] transition-colors flex items-center justify-center text-2xl"
            >
              +
            </button>
          </div>

          {/* Filter & Sort */}
          <div className="flex gap-4 items-center">
            <div className="relative w-44">
              <select className="appearance-none w-full h-14 bg-white border border-[#ECE9FB] rounded-xl pl-4 pr-10 outline-none text-[#666666] text-sm font-normal focus:ring-2 focus:ring-[#533DDE] focus:border-transparent cursor-pointer" defaultValue="">
                <option value="" disabled>
                  Department
                </option>
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
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>

            <button
              onClick={() => setActiveButton("Recent")}
              className={`w-32 h-14 rounded-xl font-medium transition-colors ${
                activeButton === "Recent"
                  ? "bg-[#533DDE] text-white"
                  : "bg-[#F8F9FF] text-[#533DDE] hover:bg-[#ECE9FB]"
              }`}
            >
              Recent
            </button>

            <button
              onClick={() => setActiveButton("Top")}
              className={`w-32 h-14 rounded-xl font-medium transition-colors ${
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
            {posts.map((post) => (
              <Postcard
                key={post._id}
                id={post._id}
                title={post.title}
                content={post.description}
                author={post.created_by?.name || "Unknown"}
                role={post.created_by?.role || ""}
                timeAgo={dayjs(post.createdAt).fromNow()}
                tags={["Post", post.scope, getDepartmentName(post.department_id)]}
                initialComments={post.comments}
              />
            ))}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-80 flex-shrink-0"></div>
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
