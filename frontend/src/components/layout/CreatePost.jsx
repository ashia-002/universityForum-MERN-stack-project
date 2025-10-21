import React, { useState } from 'react';
import api from "../../services/api.js";

const CreatePost = ({ onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    department_id: '',
    community: '',
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
    if (!formData.title || !formData.description) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);
      const postData = new FormData();
      postData.append('title', formData.title);
      postData.append('description', formData.description);
      postData.append('department_id', formData.department_id);
      postData.append('community', formData.community);
      if (image) postData.append('image', image);

      const response = await api.post("/posts/create", postData, {
        headers: { 'Content-Type': 'multipart/form-data' },
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
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[#333333]">Create Post</h2>
        <button
          onClick={onClose}
          className="text-[#666666] hover:text-[#333333] transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-[#666666] mb-2">Add a title</label>
          <input
            type="text"
            name="title"
            placeholder="Enter post title"
            value={formData.title}
            onChange={handleChange}
            className="w-full h-12 bg-[#F8F9FF] border border-[#ECE9FB] rounded-xl px-4 outline-none focus:ring-2 focus:ring-[#533DDE] focus:border-transparent"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-[#666666] mb-2">Add a description</label>
          <textarea
            name="description"
            placeholder="Enter post description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            className="w-full bg-[#F8F9FF] border border-[#ECE9FB] rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#533DDE] focus:border-transparent resize-vertical"
            required
          />
        </div>

        {/* Buttons Row: Left-aligned */}
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
              className="h-14 bg-[#F8F9FF] border border-[#ECE9FB] rounded-xl flex items-center justify-between px-4 cursor-pointer hover:bg-[#ECE9FB] transition-colors font-medium text-[#333333] min-w-[120px]"
            >
              {image ? image.name : "Choose Image"}
              <span className="text-lg">📷</span>
            </label>
          </div>

          {/* Department Dropdown */}
          <select
            name="department_id"
            value={formData.department_id}
            onChange={handleChange}
            className="h-14 bg-[#F8F9FF] border border-[#ECE9FB] rounded-xl px-4 outline-none focus:ring-2 focus:ring-[#533DDE] focus:border-transparent font-medium text-[#333333] min-w-[120px]"
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
            className="h-14 bg-[#F8F9FF] border border-[#ECE9FB] rounded-xl px-4 outline-none focus:ring-2 focus:ring-[#533DDE] focus:border-transparent font-medium text-[#333333] min-w-[120px]"
          >
            <option value="">Community</option>
            <option value="general">General Discussion</option>
            <option value="academic">Academic Help</option>
            <option value="events">Campus Events</option>
            <option value="projects">Student Projects</option>
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 bg-[#ECE9FB] text-[#533DDE] rounded-xl font-medium hover:bg-[#E0DCF9] transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-[#533DDE] text-white rounded-xl font-medium hover:bg-[#311EAE] transition-colors min-w-[120px] disabled:opacity-50"
          >
            {loading ? "Publishing..." : "Publish"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
