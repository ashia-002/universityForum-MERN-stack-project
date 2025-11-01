import React, { useState, useRef } from "react";
import api from "../../services/api.js";

const CreateCommunity = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    department_id: "", // Add department id field as backend requires it
    banner_image: "",
    icon_image: "",
  });
  const [loading, setLoading] = useState(false);
  const [newTagInput, setNewTagInput] = useState("");
  const [tags, setTags] = useState([]);
  const iconInputRef = useRef(null);
  const bannerInputRef = useRef(null);

  // Handle text input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle local preview uploads (for now using URL, not actual file upload)
  const handleFileChange = async (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      if (type === "icon") setFormData({ ...formData, icon_image: fileUrl });
      else if (type === "banner") setFormData({ ...formData, banner_image: fileUrl });
    }
  };

  // Add/Remove tags
  const handleAddTag = () => {
    const tag = newTagInput.trim();
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
      setNewTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  // ✅ Updated handleSubmit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.description || !formData.department_id) {
      alert("Please fill in all required fields including department ID.");
      return;
    }

    try {
      setLoading(true);

      // Using api.js instance which already handles baseURL + token
      const res = await api.post("/api/community/create", {
        name: formData.name,
        description: formData.description,
        department_id: formData.department_id,
        banner_image: formData.banner_image || "",
        icon_image: formData.icon_image || "",
        tags: tags,
      });

      console.log("✅ Community created:", res.data);
      alert("Community created successfully!");
      onClose(); // Close modal
    } catch (err) {
      console.error("❌ Community creation error:", err);
      alert(err.response?.data?.msg || "Failed to create community");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-5xl flex p-8 relative font-inter">
        {/* Left Section */}
        <div className="flex-1 pr-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-[#2C2C2C]">
              Create your own community!
            </h2>
            <button
              onClick={onClose}
              className="text-[#999999] hover:text-[#2C2C2C]"
            >
              ✕
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <input
              type="text"
              name="name"
              placeholder="Add a Community name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-4 border rounded-xl"
              required
            />

            {/* Description */}
            <textarea
              name="description"
              placeholder="Add a description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="w-full p-4 border rounded-xl"
              required
            />

            {/* Department ID */}
            <input
              type="text"
              name="department_id"
              placeholder="Enter Department ID"
              value={formData.department_id}
              onChange={handleChange}
              className="w-full p-4 border rounded-xl"
              required
            />

            {/* Style Community */}
            <div>
              <p className="font-semibold mb-2">Style community</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[#999999] text-base mb-2">Add icon</label>
                  <input
                    type="file"
                    ref={iconInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, "icon")}
                  />
                  <button
                    type="button"
                    onClick={() => iconInputRef.current.click()}
                    className="w-full p-3 border rounded-lg text-[#533DDE]"
                  >
                    Upload Icon
                  </button>
                </div>
                <div>
                  <label className="text-[#999999] text-base mb-2">Add banner</label>
                  <input
                    type="file"
                    ref={bannerInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, "banner")}
                  />
                  <button
                    type="button"
                    onClick={() => bannerInputRef.current.click()}
                    className="w-full p-3 border rounded-lg text-[#533DDE]"
                  >
                    Upload Banner
                  </button>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div>
              <p className="font-semibold mb-2">Add tags</p>
              <div className="flex flex-wrap items-center gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center gap-1 px-4 py-2 bg-[#F4F2FF] text-[#533DDE] rounded-full"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 text-[#533DDE]"
                    >
                      &times;
                    </button>
                  </span>
                ))}
                <input
                  type="text"
                  placeholder="Type new tag"
                  value={newTagInput}
                  onChange={(e) => setNewTagInput(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && (e.preventDefault(), handleAddTag())
                  }
                  className="px-4 py-2 bg-[#F4F2FF] text-[#533DDE] rounded-full outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-4 py-2 bg-[#533DDE] text-white rounded-full"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-8 py-3 bg-[#EBEBEB] text-[#555555] rounded-lg"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-[#533DDE] text-white rounded-lg"
              >
                {loading ? "Creating..." : "Create"}
              </button>
            </div>
          </form>
        </div>

        {/* Right Section Preview */}
        <div className="w-[300px] flex-shrink-0 pt-16">
          <div className="relative bg-white rounded-xl shadow-lg border overflow-hidden">
            <div
              className="w-full h-24 bg-[#E0DCF9]"
              style={{
                backgroundImage: formData.banner_image
                  ? `url(${formData.banner_image})`
                  : "none",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {!formData.banner_image && "Banner Preview"}
            </div>
            <div className="absolute top-16 left-4 w-16 h-16 rounded-full border-4 border-white overflow-hidden bg-[#533DDE] flex items-center justify-center text-white text-lg">
              {formData.icon_image ? (
                <img
                  src={formData.icon_image}
                  alt="Icon Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                "🤍"
              )}
            </div>
            <div className="p-4 pt-10">
              <p className="text-[#999999] text-xs mb-1">
                {tags.length > 0 ? tags[0] : "Category"}
              </p>
              <h3 className="text-xl font-bold text-[#2C2C2C] mb-1">
                {formData.name || "Community name"}
              </h3>
              <p className="text-[#555555] text-sm mb-3">1 member • 1 online</p>
              <p className="text-[#999999] text-sm leading-relaxed">
                {formData.description || "This is the description you added."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCommunity;
