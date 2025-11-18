import React, { useState, useEffect } from "react";
import api from "../../services/api.js";

const CreateEvent = ({ onClose, onAddEvent }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    venue: "",
    date: "",
    time: "",
    department_id: "",
    community_id: "",
    image: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [venueAdded, setVenueAdded] = useState(false);
  const [dateAdded, setDateAdded] = useState(false);
  const [timeAdded, setTimeAdded] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [loadingDepartments, setLoadingDepartments] = useState(false);

  // Fetch departments from API
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        setLoadingDepartments(true);
        console.log("Fetching departments from /get/department");
        const deptResponse = await api.get("/get/department");
        console.log("Departments response:", deptResponse.data);
        setDepartments(deptResponse.data || []);
      } catch (error) {
        console.error("Error fetching departments:", error);
        console.error("Department error response:", error.response?.data);
      } finally {
        setLoadingDepartments(false);
      }
    };

    fetchDepartments();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleVenueToggle = () => {
    setVenueAdded(!venueAdded);
    if (venueAdded) {
      setFormData({ ...formData, venue: "" });
    }
  };

  const handleDateToggle = () => {
    setDateAdded(!dateAdded);
    if (dateAdded) {
      setFormData({ ...formData, date: "" });
    }
  };

  const handleTimeToggle = () => {
    setTimeAdded(!timeAdded);
    if (timeAdded) {
      setFormData({ ...formData, time: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Required fields validation
    if (!formData.title || !formData.description || !formData.department_id || !formData.time) {
      alert("Please fill in all required fields including time");
      return;
    }

    try {
      setLoading(true);
      let imageUrl = "";

      // Upload image if selected - USING THE CORRECT ENDPOINT
      if (imageFile) {
        try {
          console.log("Attempting to upload image:", imageFile);
          const imgData = new FormData();
          imgData.append("image", imageFile); // Key should be "image" not "file"

          const imgRes = await api.post("/upload/image", imgData, {
            headers: { "Content-Type": "multipart/form-data" },
          });

          console.log("Image upload response:", imgRes.data);
          imageUrl = imgRes.data.url; // Get URL from response
        } catch (uploadError) {
          console.error("❌ Image upload failed:", uploadError);
          console.log("Image upload error details:", uploadError.response?.data);
          alert("Image upload failed, but event will be created without image");
          imageUrl = "";
        }
      }

      // Combine date and time if both are provided
      let eventDateTime = "";
      if (formData.date && formData.time) {
        const combinedDateTime = `${formData.date}T${formData.time}`;
        eventDateTime = combinedDateTime;
      } else if (formData.date) {
        eventDateTime = formData.date;
      }

      // Prepare payload according to your API
      const payload = {
        title: formData.title,
        description: formData.description,
        venue: venueAdded ? formData.venue : "",
        date: eventDateTime,
        time: formData.time,
        scope: "university",
        community_id: formData.community_id || null,
        department_id: formData.department_id,
        image: imageUrl,
      };

      console.log("Sending event payload:", payload);

      // Create event
      const response = await api.post("/event/create", payload);

      console.log("Event creation response:", response.data);
      alert("Event created successfully!");

      // ✅ Add the new event to Dashboard immediately
      if (onAddEvent) {
        onAddEvent(response.data.event || response.data);
      }

      onClose();
    } catch (error) {
      console.error("❌ Event creation error:", error);
      console.error("Error details:", error.response?.data);
      alert(error.response?.data?.msg || error.response?.data?.message || "Failed to create event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-10 bg-white rounded-3xl shadow-xl font-poppins">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-semibold text-[#2C2C2C]">Create Event</h2>
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
          <label className="block text-base font-medium text-[#555] mb-2">Add a title</label>
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
          <label className="block text-base font-medium text-[#555] mb-2">Add a description</label>
          <textarea
            name="description"
            placeholder="Write your event details..."
            value={formData.description}
            onChange={handleChange}
            rows="4"
            className="w-full bg-[#F8F9FF] border border-[#E3E0F9] rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#533DDE] text-[#333] resize-none"
            required
          />
        </div>

        {/* Toggle Fields */}
        <div className="space-y-4">
          {/* Venue Toggle */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleVenueToggle}
              className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                venueAdded 
                  ? "bg-[#533DDE] border-[#533DDE]" 
                  : "border-[#E3E0F9] bg-white"
              }`}
            >
              {venueAdded && (
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
            <span className="text-[#555] font-medium">Add venue</span>
          </div>

          {venueAdded && (
            <div className="ml-8">
              <input
                type="text"
                name="venue"
                placeholder="Enter event venue"
                value={formData.venue}
                onChange={handleChange}
                className="w-full h-14 bg-[#F8F9FF] border border-[#E3E0F9] rounded-xl px-4 outline-none focus:ring-2 focus:ring-[#533DDE] text-[#333]"
              />
            </div>
          )}

          {/* Date Toggle */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleDateToggle}
              className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                dateAdded 
                  ? "bg-[#533DDE] border-[#533DDE]" 
                  : "border-[#E3E0F9] bg-white"
              }`}
            >
              {dateAdded && (
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
            <span className="text-[#555] font-medium">Add Date</span>
          </div>

          {dateAdded && (
            <div className="ml-8">
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full h-14 bg-[#F8F9FF] border border-[#E3E0F9] rounded-xl px-4 outline-none focus:ring-2 focus:ring-[#533DDE] text-[#333]"
              />
            </div>
          )}

          {/* Time Toggle */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleTimeToggle}
              className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                timeAdded 
                  ? "bg-[#533DDE] border-[#533DDE]" 
                  : "border-[#E3E0F9] bg-white"
              }`}
            >
              {timeAdded && (
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
            <span className="text-[#555] font-medium">Add Time</span>
          </div>

          {timeAdded && (
            <div className="ml-8">
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                className="w-full h-14 bg-[#F8F9FF] border border-[#E3E0F9] rounded-xl px-4 outline-none focus:ring-2 focus:ring-[#533DDE] text-[#333]"
                required
              />
            </div>
          )}
        </div>

        {/* Image Upload - NOW WITH CORRECT ENDPOINT */}
        <div>
          <label className="block text-base font-medium text-[#555] mb-2">Image (Optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full text-sm text-[#555]"
          />
          <p className="text-sm text-[#666] mt-1">Select an image to upload</p>
        </div>

        {/* Department and Community Selection */}
        <div className="flex items-center gap-4">
          <select
            name="department_id"
            value={formData.department_id}
            onChange={handleChange}
            className="w-36 h-14 bg-[#F8F9FF] border border-[#E3E0F9] rounded-xl px-4 outline-none focus:ring-2 focus:ring-[#533DDE] text-[#533DDE] font-medium"
            required
            disabled={loadingDepartments}
          >
            <option value="">Select Department</option>
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
          >
            <option value="">Select Community</option>
            <option value="68e689f2fe6bae63caea2901">General Discussion</option>
            <option value="68e689f2fe6bae63caea2902">Academic Help</option>
            <option value="68e689f2fe6bae63caea2903">Campus Events</option>
            <option value="68e689f2fe6bae63caea2904">Student Projects</option>
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

export default CreateEvent;