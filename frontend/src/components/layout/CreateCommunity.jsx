import React, { useState, useRef } from "react";
import api from "../../services/api.js";

const CreateCommunity = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    department_id: "",
    banner_image: "",
    icon_image: "",
  });
  const [loading, setLoading] = useState(false);
  const [newTagInput, setNewTagInput] = useState("");
  const [tags, setTags] = useState([]);
  const [bannerFile, setBannerFile] = useState(null); // ✅ Store actual file objects
  const [iconFile, setIconFile] = useState(null);     // ✅ Store actual file objects
  const iconInputRef = useRef(null);
  const bannerInputRef = useRef(null);

  // Handle text input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Option 1: Convert to Base64 for preview
  const handleFileChange = async (e, type) => {
    const file = e.target.files[0];
    if (file) {
      // Store the actual file for upload
      if (type === "icon") setIconFile(file);
      else if (type === "banner") setBannerFile(file);

      // Convert to base64 for preview (fixes security error)
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64String = event.target.result;
        if (type === "icon") {
          setFormData(prev => ({ ...prev, icon_image: base64String }));
        } else if (type === "banner") {
          setFormData(prev => ({ ...prev, banner_image: base64String }));
        }
      };
      reader.readAsDataURL(file);
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

  // ✅ Option 2: Use FormData for actual file upload
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.description || !formData.department_id) {
      alert("Please fill in all required fields including department ID.");
      return;
    }

    try {
      setLoading(true);

      // Create FormData for file upload
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('description', formData.description);
      submitData.append('department_id', formData.department_id);
      submitData.append('tags', JSON.stringify(tags));

      // Append actual files if they exist
      if (bannerFile) {
        submitData.append('banner_image', bannerFile);
      }
      if (iconFile) {
        submitData.append('icon_image', iconFile);
      }

      console.log("Submitting FormData with files:", {
        name: formData.name,
        description: formData.description,
        department_id: formData.department_id,
        tags: tags,
        bannerFile: bannerFile?.name,
        iconFile: iconFile?.name
      });

      const res = await api.post("/community/create", submitData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
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

  // Clear file inputs when modal closes
  const handleClose = () => {
    setBannerFile(null);
    setIconFile(null);
    onClose();
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
              onClick={handleClose}
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
                    className="w-full p-3 border rounded-lg text-[#533DDE] hover:bg-[#F8F9FF] transition-colors"
                  >
                    {iconFile ? `Icon: ${iconFile.name}` : "Upload Icon"}
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
                    className="w-full p-3 border rounded-lg text-[#533DDE] hover:bg-[#F8F9FF] transition-colors"
                  >
                    {bannerFile ? `Banner: ${bannerFile.name}` : "Upload Banner"}
                  </button>
                </div>
              </div>
              {/* File status indicators */}
              <div className="mt-2 text-xs text-[#666666]">
                {iconFile && <div>✓ Icon selected: {iconFile.name}</div>}
                {bannerFile && <div>✓ Banner selected: {bannerFile.name}</div>}
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
                      className="ml-1 text-[#533DDE] hover:text-[#311EAE]"
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
                  className="px-4 py-2 bg-[#F4F2FF] text-[#533DDE] rounded-full outline-none placeholder-[#533DDE] placeholder-opacity-60"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-4 py-2 bg-[#533DDE] text-white rounded-full hover:bg-[#311EAE] transition-colors"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-6">
              <button
                type="button"
                onClick={handleClose}
                className="px-8 py-3 bg-[#EBEBEB] text-[#555555] rounded-lg hover:bg-[#DDDDDD] transition-colors"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-[#533DDE] text-white rounded-lg hover:bg-[#311EAE] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
              {!formData.banner_image && (
                <div className="w-full h-full flex items-center justify-center text-[#999999] text-sm">
                  Banner Preview
                </div>
              )}
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