import React, { useState } from "react";
import api from "../../services/api.js";

const CreateEvent = ({ onClose }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    department: "",
    community: "",
    location: "",
  });
  const [image, setImage] = useState(null);
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) setImage(file);
  };

  const handleAddTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.title ||
      !formData.description ||
      !formData.date ||
      !formData.time ||
      !formData.department ||
      !formData.community
    ) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);

      const eventData = new FormData();
      Object.keys(formData).forEach((key) => eventData.append(key, formData[key]));
      eventData.append("tags", JSON.stringify(tags));
      if (image) eventData.append("image", image);

      const res = await api.post("/event/create", eventData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Event created successfully!");
      console.log("Created Event:", res.data);
      onClose();
    } catch (err) {
      console.error("Event creation error:", err);
      alert(err.response?.data?.message || "Failed to create event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-10 bg-white rounded-3xl shadow-xl font-poppins w-full max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-semibold text-[#2C2C2C]">Create Event</h2>
        <button onClick={onClose} className="text-[#666] hover:text-[#2C2C2C] transition-colors">
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-base font-medium text-[#555] mb-2">Event Title</label>
          <input
            type="text"
            name="title"
            placeholder="Enter event title"
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
            placeholder="Write event details..."
            value={formData.description}
            onChange={handleChange}
            rows="4"
            className="w-full bg-[#F8F9FF] border border-[#E3E0F9] rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#533DDE] text-[#333] resize-none"
            required
          />
        </div>

        {/* Style Commuting Row: Add Icon / Image / Tags */}
        <div className="flex flex-wrap gap-4">
          {/* Add Image */}
          <div>
            <input
              type="file"
              id="event-image-upload"
              className="hidden"
              accept="image/*"
              onChange={handleImageUpload}
            />
            <label
              htmlFor="event-image-upload"
              className="w-40 h-14 bg-[#F8F9FF] border border-[#E3E0F9] rounded-xl flex items-center justify-center gap-2 cursor-pointer hover:bg-[#ECE9FB] transition-colors text-[#533DDE] font-medium"
            >
              🖼 Upload Image
            </label>
          </div>

          {/* Add Tag Input */}
          <div className="flex flex-wrap items-center gap-2 flex-1">
            {tags.map((tag) => (
              <span
                key={tag}
                className="bg-[#ECE9FB] text-[#533DDE] px-3 py-1 rounded-full flex items-center gap-2"
              >
                {tag}
                <button type="button" onClick={() => handleRemoveTag(tag)}>
                  ✕
                </button>
              </span>
            ))}
            <input
              type="text"
              placeholder="Add tag"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
              className="h-14 bg-[#F8F9FF] border border-[#E3E0F9] rounded-xl px-4 outline-none focus:ring-2 focus:ring-[#533DDE] text-[#333] flex-1"
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="px-4 py-2 bg-[#533DDE] text-white rounded-xl font-medium hover:bg-[#311EAE] transition-colors"
            >
              Add
            </button>
          </div>
        </div>

        {/* Date, Time, Location */}
        <div className="flex flex-wrap gap-4">
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-40 h-14 bg-[#F8F9FF] border border-[#E3E0F9] rounded-xl px-4 outline-none focus:ring-2 focus:ring-[#533DDE] text-[#333]"
            required
          />
          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            className="w-40 h-14 bg-[#F8F9FF] border border-[#E3E0F9] rounded-xl px-4 outline-none focus:ring-2 focus:ring-[#533DDE] text-[#333]"
            required
          />
          <input
            type="text"
            name="location"
            placeholder="Event Location"
            value={formData.location}
            onChange={handleChange}
            className="w-40 h-14 bg-[#F8F9FF] border border-[#E3E0F9] rounded-xl px-4 outline-none focus:ring-2 focus:ring-[#533DDE] text-[#333]"
          />
        </div>

        {/* Department & Community */}
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
            name="community"
            value={formData.community}
            onChange={handleChange}
            className="w-40 h-14 bg-[#F8F9FF] border border-[#E3E0F9] rounded-xl px-4 outline-none focus:ring-2 focus:ring-[#533DDE] text-[#533DDE] font-medium"
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
            {loading ? "Creating..." : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateEvent;
