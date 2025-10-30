import React, { useState } from "react";
import api from "../../services/api.js";

const CreateCommunity = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    department: "",
    privacy: "public",
    tags: [],
  });
  const [banner, setBanner] = useState(null);
  const [loading, setLoading] = useState(false);
  const [newTag, setNewTag] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBannerUpload = (event) => {
    const file = event.target.files[0];
    if (file) setBanner(file);
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, newTag.trim()] });
      setNewTag("");
    }
  };

  const handleRemoveTag = (tag) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((t) => t !== tag),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.description || !formData.department) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);
      const communityData = new FormData();
      communityData.append("name", formData.name);
      communityData.append("description", formData.description);
      communityData.append("department", formData.department);
      communityData.append("privacy", formData.privacy);
      formData.tags.forEach((tag) => communityData.append("tags[]", tag));
      if (banner) communityData.append("banner", banner);

      const res = await api.post("/community/create", communityData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Community created successfully!");
      console.log("Created Community:", res.data);
      onClose();
    } catch (err) {
      console.error("Community creation error:", err);
      alert(err.response?.data?.message || "Failed to create community");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-10 bg-white rounded-3xl shadow-xl font-poppins w-full max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-semibold text-[#2C2C2C]">
          Create Community
        </h2>
        <button
          onClick={onClose}
          className="text-[#666] hover:text-[#2C2C2C] transition-colors"
        >
          <svg
            className="w-7 h-7"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Banner Upload */}
        <div>
          <input
            type="file"
            id="banner-upload"
            className="hidden"
            accept="image/*"
            onChange={handleBannerUpload}
          />
          <label
            htmlFor="banner-upload"
            className="w-full h-14 bg-[#F8F9FF] border border-[#E3E0F9] rounded-xl flex items-center justify-center gap-2 cursor-pointer hover:bg-[#ECE9FB] transition-colors text-[#533DDE] font-medium"
          >
            🖼 Add Banner
          </label>
        </div>

        {/* Style Commuting / Options Row */}
        <div className="flex flex-wrap gap-4 mt-3">
          {/* Add Icon */}
          <button
            type="button"
            className="flex items-center gap-2 px-4 py-3 bg-[#F8F9FF] rounded-xl border border-[#E3E0F9] hover:bg-[#ECE9FB] transition-colors text-[#533DDE] font-medium"
          >
            ➕ Add Icon
          </button>

          {/* Add Image */}
          <button
            type="button"
            className="flex items-center gap-2 px-4 py-3 bg-[#F8F9FF] rounded-xl border border-[#E3E0F9] hover:bg-[#ECE9FB] transition-colors text-[#533DDE] font-medium"
          >
            🖼 Add Image
          </button>

          {/* Add Tags */}
          <div className="flex items-center gap-2 px-4 py-3 bg-[#F8F9FF] rounded-xl border border-[#E3E0F9] hover:bg-[#ECE9FB] transition-colors">
            <input
              type="text"
              placeholder="Add tag"
              className="bg-transparent outline-none text-[#533DDE] placeholder:text-[#999999] text-sm w-20"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="text-[#533DDE] font-medium text-sm"
            >
              +
            </button>
          </div>
        </div>

        {/* Display Tags */}
        {formData.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.tags.map((tag, index) => (
              <span
                key={index}
                className="flex items-center gap-1 px-3 py-1 bg-[#F4F2FF] text-[#533DDE] rounded-full text-sm font-medium"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="text-[#533DDE] font-bold"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Community Name */}
        <div>
          <label className="block text-base font-medium text-[#555] mb-2">
            Community Name
          </label>
          <input
            type="text"
            name="name"
            placeholder="Enter community name"
            value={formData.name}
            onChange={handleChange}
            className="w-full h-14 bg-[#F8F9FF] border border-[#E3E0F9] rounded-xl px-4 outline-none focus:ring-2 focus:ring-[#533DDE] text-[#333]"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-base font-medium text-[#555] mb-2">
            Description
          </label>
          <textarea
            name="description"
            placeholder="Describe your community..."
            value={formData.description}
            onChange={handleChange}
            rows="4"
            className="w-full bg-[#F8F9FF] border border-[#E3E0F9] rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#533DDE] text-[#333] resize-none"
            required
          />
        </div>

        {/* Department & Privacy */}
        <div className="flex flex-wrap gap-4">
          <select
            name="department"
            value={formData.department}
            onChange={handleChange}
            className="w-40 h-14 bg-[#F8F9FF] border border-[#E3E0F9] rounded-xl px-4 outline-none focus:ring-2 focus:ring-[#533DDE] text-[#533DDE] font-medium"
            required
          >
            <option value="">Department</option>
            <option value="cse">CSE</option>
            <option value="bba">BBA</option>
            <option value="ece">ECE</option>
          </select>

          <select
            name="privacy"
            value={formData.privacy}
            onChange={handleChange}
            className="w-40 h-14 bg-[#F8F9FF] border border-[#E3E0F9] rounded-xl px-4 outline-none focus:ring-2 focus:ring-[#533DDE] text-[#533DDE] font-medium"
          >
            <option value="public">Public</option>
            <option value="private">Private</option>
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
            {loading ? "Creating..." : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateCommunity;
