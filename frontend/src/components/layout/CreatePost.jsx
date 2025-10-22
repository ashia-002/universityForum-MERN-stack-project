import React, { useState } from "react";
import api from "../../services/api.js";

const CreatePost = ({ onClose }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    department: "",
    community: "",
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) setImage(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.department || !formData.community) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);

      // Using FormData for image upload
      const postData = new FormData();
      postData.append("title", formData.title);
      postData.append("description", formData.description);
      postData.append("department", formData.department);
      postData.append("community", formData.community);
      if (image) postData.append("image", image);

      const response = await api.post("/post/create", postData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Post created successfully!");
      console.log("Created Post:", response.data);
      onClose();
    } catch (error) {
      console.error("Post creation error:", error);
      alert(error.response?.data?.message || "Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-10 bg-white rounded-3xl shadow-xl font-poppins">
      {/* Header */}
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
        {/* Title */}
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

        {/* Description */}
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

        {/* Buttons Row */}
        <div className="flex items-center gap-4">
          {/* Image Upload */}
          <div>
            <input
              type="file"
              id="image-upload"
              className="hidden"
              accept="image/*"
              onChange={handleImageUpload}
            />
            <label
              htmlFor="image-upload"
              className="w-36 h-14 bg-[#F8F9FF] border border-[#E3E0F9] rounded-xl flex items-center justify-center gap-2 cursor-pointer hover:bg-[#ECE9FB] transition-colors text-[#533DDE] font-medium"
            >
              📷 Image
            </label>
          </div>

          {/* Department Dropdown */}
          <select
            name="department"
            value={formData.department}
            onChange={handleChange}
            className="w-36 h-14 bg-[#F8F9FF] border border-[#E3E0F9] rounded-xl px-4 outline-none focus:ring-2 focus:ring-[#533DDE] text-[#533DDE] font-medium"
            required
          >
            <option value="">Department</option>
            <option value="cse">CSE</option>
            <option value="bba">BBA</option>
            <option value="ece">ECE</option>
          </select>

          {/* Community Dropdown */}
          <select
            name="community"
            value={formData.community}
            onChange={handleChange}
            className="w-36 h-14 bg-[#F8F9FF] border border-[#E3E0F9] rounded-xl px-4 outline-none focus:ring-2 focus:ring-[#533DDE] text-[#533DDE] font-medium"
            required
          >
            <option value="">Community</option>
            <option value="general">General Discussion</option>
            <option value="academic">Academic Help</option>
            <option value="events">Campus Events</option>
            <option value="projects">Student Projects</option>
          </select>
        </div>

        {/* Divider */}
        <div className="border-t border-[#ECE9FB] my-6"></div>

        {/* Action Buttons */}
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
