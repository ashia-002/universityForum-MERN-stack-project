// src/components/CreatePost.jsx
import React, { useState } from "react";
import api from "../../services/api.js";

const CreatePost = ({ onClose }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    department_id: "",
    community_id: "",
    image: "", // will store image URL
  });
  const [imageFile, setImageFile] = useState(null); // store selected file
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.department_id) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);

      let imageUrl = formData.image;

      // Upload image if selected
      if (imageFile) {
        const imgData = new FormData();
        imgData.append("file", imageFile);

        const imgRes = await api.post("/upload", imgData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        imageUrl = imgRes.data.url; // assume backend returns { url: "..." }
      }

      const payload = {
        title: formData.title,
        description: formData.description,
        scope: "university",
        community_id: formData.community_id || null,
        department_id: formData.department_id,
        image: imageUrl || "",
      };

      console.log("Payload to backend:", payload);

      const response = await api.post("/post/create", payload);

      alert("Post created successfully!");
      console.log("Created Post:", response.data);
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
          >
            <option value="">Department</option>
            <option value="68e68902fe6bae63caea28c7">CSE</option>
            <option value="68e68902fe6bae63caea28c8">BBA</option>
            <option value="68e68902fe6bae63caea28c9">ECE</option>
          </select>

          <select
            name="community_id"
            value={formData.community_id}
            onChange={handleChange}
            className="w-36 h-14 bg-[#F8F9FF] border border-[#E3E0F9] rounded-xl px-4 outline-none focus:ring-2 focus:ring-[#533DDE] text-[#533DDE] font-medium"
          >
            <option value="">Community</option>
            <option value="68e689f2fe6bae63caea2901">General Discussion</option>
            <option value="68e689f2fe6bae63caea2902">Academic Help</option>
            <option value="68e689f2fe6bae63caea2903">Campus Events</option>
            <option value="68e689f2fe6bae63caea2904">Student Projects</option>
          </select>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-base font-medium text-[#555] mb-2">Attach Image (optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full text-sm text-[#555]"
          />
        </div>

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
