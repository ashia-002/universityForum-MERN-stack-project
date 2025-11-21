// src/components/layout/AnnouncementDashboard.jsx
import React, { useState, useEffect } from "react";
import CreateAnnouncement from "./CreateAnnouncement";
import Postcard from "./PostCard"; // ✅ Corrected import path
import api from "../../services/api";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

const AnnouncementDashboard = () => {
  const [showCreateAnnouncement, setShowCreateAnnouncement] = useState(false);
  const [activeButton, setActiveButton] = useState("Recent");
  const [announcements, setAnnouncements] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedDept, setSelectedDept] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [announcementsRes, deptRes] = await Promise.all([
          api.get("/announcement/all-announcements"),
          api.get("/get/department"),
        ]);
        setAnnouncements(announcementsRes.data.announcements || announcementsRes.data || []);
        setDepartments(deptRes.data || []);
      } catch (err) {
        console.error("Error fetching data:", err);
        // For demo purposes, use mock data if endpoint doesn't exist
        if (err.response?.status === 404) {
          setAnnouncements([
            {
              _id: "1",
              title: "University Holiday Announcement",
              description: "The university will be closed on Monday for maintenance work. All classes will resume on Tuesday.",
              created_by: { name: "Admin Office", role: "Administration" },
              createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
              scope: "university",
              department_id: "",
              comments: []
            },
            {
              _id: "2",
              title: "Library Hours Update",
              description: "Starting next week, the library will extend its hours until 10 PM on weekdays.",
              created_by: { name: "Library Department", role: "Staff" },
              createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
              scope: "university",
              department_id: "",
              comments: []
            }
          ]);
        }
      }
    };
    fetchData();
  }, []);

  const getDepartmentName = (id) => {
    if (!id) return "University Wide";
    const dept = departments.find((d) => d._id === id);
    return dept ? dept.name : "Unknown Department";
  };

  // Filter & sort announcements
  const filteredAnnouncements = announcements
    .filter((announcement) =>
      selectedDept ? announcement.department_id === selectedDept : true
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
          showCreateAnnouncement ? "blur-sm pointer-events-none select-none" : ""
        } ${window.innerWidth >= 1024 ? "ml-80" : ""}`}
      >
        <div className="flex-1 flex flex-col gap-4">
          {/* Create Announcement */}
          <div className="flex justify-between items-center bg-white rounded-2xl p-4 sm:p-6 shadow-[0px_4px_20px_rgba(100,81,225,0.15)]">
            <h1 className="text-lg sm:text-xl font-semibold text-[#333333]">
              Create Announcement
            </h1>
            <button
              onClick={() => setShowCreateAnnouncement(true)}
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

          {/* Render Announcements */}
          <div className="flex flex-col gap-4">
            {filteredAnnouncements.length > 0 ? (
              filteredAnnouncements.map((announcement) => (
                <Postcard
                  key={announcement._id}
                  id={announcement._id}
                  title={announcement.title}
                  content={announcement.description}
                  author={announcement.created_by || { name: "Unknown", role: "" }}
                  timeAgo={`Posted ${dayjs(announcement.createdAt).fromNow()}`}
                  tags={[
                    "Announcement",
                    announcement.scope || "university",
                    getDepartmentName(announcement.department_id),
                  ]}
                  initialComments={announcement.comments || []}
                  type="announcement"
                />
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                No announcements yet. Create the first one!
              </div>
            )}
          </div>
        </div>

        <div className="hidden lg:block w-80 flex-shrink-0"></div>
      </div>

      {/* Create Announcement Modal */}
      {showCreateAnnouncement && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-6xl">
            <CreateAnnouncement
              onClose={() => setShowCreateAnnouncement(false)}
              onAddAnnouncement={(newAnnouncement) => setAnnouncements([newAnnouncement, ...announcements])}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AnnouncementDashboard;