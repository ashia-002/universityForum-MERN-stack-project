// src/components/layout/EventDashboard.jsx
import React, { useState, useEffect } from "react";
import CreateEvent from "./CreateEvent";
import EventCard from "./EventCard";
import api from "../../services/api";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

const EventDashboard = () => {
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [activeButton, setActiveButton] = useState("Upcoming");
  const [events, setEvents] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedDept, setSelectedDept] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState("");
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    eventId: null,
    eventTitle: ""
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [eventsRes, deptRes] = await Promise.all([
          api.get("/event/all-events"),
          api.get("/get/department"),
        ]);
        
        console.log("Events API Response:", eventsRes.data);
        console.log("Departments API Response:", deptRes.data);
        
        setEvents(eventsRes.data.events || eventsRes.data || []);
        setDepartments(deptRes.data || []);
      } catch (err) {
        console.error("Error fetching data:", err);
        alert("Failed to load events");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getDepartmentName = (id) => {
    if (!id) return "Unknown Department";
    
    const dept = departments.find((d) => d._id === id);
    return dept ? dept.name : "Unknown Department";
  };

  // Handle event deletion
  const handleDeleteEvent = (deletedEventId) => {
    setEvents(prevEvents => prevEvents.filter(event => event._id !== deletedEventId));
    setDeleteModal({ isOpen: false, eventId: null, eventTitle: "" });
  };

  // Open delete confirmation modal
  const openDeleteModal = (eventId, eventTitle) => {
    setDeleteModal({
      isOpen: true,
      eventId,
      eventTitle
    });
  };

  // Close delete confirmation modal
  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, eventId: null, eventTitle: "" });
  };

  // Handle event editing (placeholder for now)
  const handleEditEvent = (eventId) => {
    console.log("Edit event:", eventId);
    // TODO: Implement edit modal or functionality
  };

  // ✅ Added: Dynamic calendar functions
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    
    const days = [];
    
    // Add empty cells for days before the first day of month
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const handleDateSelect = (day) => {
    if (day) {
      const selected = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      setSelectedDate(selected.toISOString());
    }
  };

  const isToday = (day) => {
    if (!day) return false;
    const today = new Date();
    return (
      day === today.getDate() &&
      currentMonth.getMonth() === today.getMonth() &&
      currentMonth.getFullYear() === today.getFullYear()
    );
  };

  const isSelectedDate = (day) => {
    if (!day || !selectedDate) return false;
    const selected = new Date(selectedDate);
    return (
      day === selected.getDate() &&
      currentMonth.getMonth() === selected.getMonth() &&
      currentMonth.getFullYear() === selected.getFullYear()
    );
  };

  // Filter & sort events - UPDATED with better department filtering
  const filteredEvents = events
    .filter((event) => {
      // Department filter - handle different possible field names
      let departmentMatch = true;
      if (selectedDept) {
        // Check multiple possible field names for department ID
        const eventDeptId = event.department_id || event.department || event.departmentId;
        departmentMatch = eventDeptId === selectedDept;
        
        console.log(`Event: ${event.title}, Dept ID: ${eventDeptId}, Selected: ${selectedDept}, Match: ${departmentMatch}`);
      }
      
      // Date filter
      let dateMatch = true;
      if (selectedDate) {
        const eventDate = dayjs(event.date).format('YYYY-MM-DD');
        const selectedDateFormatted = dayjs(selectedDate).format('YYYY-MM-DD');
        dateMatch = eventDate === selectedDateFormatted;
      }
      
      return departmentMatch && dateMatch;
    })
    .sort((a, b) => {
      if (activeButton === "Upcoming") {
        // Show soonest events first
        return new Date(a.date || a.createdAt) - new Date(b.date || b.createdAt);
      } else if (activeButton === "Recent") {
        // Show most recently created first
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else if (activeButton === "Popular") {
        // Sort by number of attendees or comments
        const aPopularity = (a.attendees?.length || 0) + (a.comments?.length || 0) + (a.likes?.length || 0);
        const bPopularity = (b.attendees?.length || 0) + (b.comments?.length || 0) + (b.likes?.length || 0);
        return bPopularity - aPopularity;
      }
      return 0;
    });

  // Clear all filters
  const clearAllFilters = () => {
    setSelectedDate("");
    setSelectedDept("");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF9FF] font-poppins flex items-center justify-center">
        <div className="text-[#533DDE] text-lg">Loading events...</div>
      </div>
    );
  }

  const calendarDays = generateCalendarDays();
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="min-h-screen bg-[#FAF9FF] font-poppins">
      <div
        className={`pt-32 px-4 sm:px-6 md:px-8 lg:px-10 flex flex-col lg:flex-row gap-6 transition-all duration-300 ${
          showCreateEvent ? "blur-sm pointer-events-none select-none" : ""
        } ${window.innerWidth >= 1024 ? "ml-80" : ""}`}
      >
        {/* Main Content */}
        <div className="flex-1 flex flex-col gap-4">
          {/* Add Event */}
          <div className="flex justify-between items-center bg-white rounded-2xl p-4 sm:p-6 shadow-[0px_4px_20px_rgba(100,81,225,0.15)]">
            <h1 className="text-lg sm:text-xl font-semibold text-[#333333]">
              Create a new event
            </h1>
            <button
              onClick={() => setShowCreateEvent(true)}
              className="w-10 h-10 sm:w-12 sm:h-12 bg-[#533DDE] text-white rounded-xl font-medium hover:bg-[#311EAE] transition-colors flex items-center justify-center text-xl sm:text-2xl"
            >
              +
            </button>
          </div>

          {/* Filter & Sort */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center">
            {/* Department Dropdown */}
            <div className="relative w-full sm:w-44">
              <select
                className="appearance-none w-full h-12 bg-white border border-[#ECE9FB] rounded-xl pl-4 pr-10 outline-none text-[#666666] text-sm font-normal focus:ring-2 focus:ring-[#533DDE] focus:border-transparent cursor-pointer"
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

            {/* Sort Buttons */}
            <div className="flex flex-wrap gap-2 sm:gap-3 w-full sm:w-auto">
              <button
                onClick={() => setActiveButton("Upcoming")}
                className={`flex-1 sm:flex-none sm:w-28 h-10 sm:h-12 rounded-xl font-medium transition-colors text-sm sm:text-base ${
                  activeButton === "Upcoming"
                    ? "bg-[#533DDE] text-white"
                    : "bg-[#F8F9FF] text-[#533DDE] hover:bg-[#ECE9FB]"
                }`}
              >
                Upcoming
              </button>

              <button
                onClick={() => setActiveButton("Recent")}
                className={`flex-1 sm:flex-none sm:w-28 h-10 sm:h-12 rounded-xl font-medium transition-colors text-sm sm:text-base ${
                  activeButton === "Recent"
                    ? "bg-[#533DDE] text-white"
                    : "bg-[#F8F9FF] text-[#533DDE] hover:bg-[#ECE9FB]"
                }`}
              >
                Recent
              </button>

              <button
                onClick={() => setActiveButton("Popular")}
                className={`flex-1 sm:flex-none sm:w-28 h-10 sm:h-12 rounded-xl font-medium transition-colors text-sm sm:text-base ${
                  activeButton === "Popular"
                    ? "bg-[#533DDE] text-white"
                    : "bg-[#F8F9FF] text-[#533DDE] hover:bg-[#ECE9FB]"
                }`}
              >
                Popular
              </button>
            </div>
          </div>

          {/* Active Filters Info */}
          {(selectedDate || selectedDept) && (
            <div className="flex items-center justify-between bg-[#F8F9FF] rounded-xl p-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-[#533DDE] font-medium">Active filters:</span>
                {selectedDept && (
                  <span className="text-sm text-[#533DDE] bg-[#ECE9FB] px-2 py-1 rounded">
                    Department: {departments.find(d => d._id === selectedDept)?.name}
                  </span>
                )}
                {selectedDate && (
                  <span className="text-sm text-[#533DDE] bg-[#ECE9FB] px-2 py-1 rounded">
                    Date: {dayjs(selectedDate).format('MMM D, YYYY')}
                  </span>
                )}
              </div>
              <button
                onClick={clearAllFilters}
                className="text-[#666] hover:text-[#333] text-sm font-medium"
              >
                Clear All
              </button>
            </div>
          )}

          {/* Events Count */}
          <div className="text-sm text-[#666666]">
            Showing {filteredEvents.length} of {events.length} events
          </div>

          {/* Render Events */}
          <div className="flex flex-col gap-4">
            {filteredEvents.length > 0 ? (
              filteredEvents.map((event) => (
                <EventCard
                  key={event._id}
                  id={event._id}
                  title={event.title}
                  description={event.description}
                  venue={event.venue}
                  date={event.date}
                  author={event.created_by?.name || "Unknown"}
                  role={event.created_by?.role || ""}
                  timeAgo={`Created ${dayjs(event.createdAt).fromNow()}`}
                  tags={[
                    "Event",
                    event.scope,
                    getDepartmentName(event.department_id || event.department || event.departmentId),
                  ]}
                  initialComments={event.comments || []}
                  attendees={event.attendees || []}
                  image={event.image}
                  likes={event.likes || []}
                  interestedUsers={event.interestedUsers || event.attendees || []}
                  onDelete={() => openDeleteModal(event._id, event.title)}
                  onEdit={handleEditEvent}
                />
              ))
            ) : (
              <div className="bg-white rounded-2xl p-8 text-center">
                <p className="text-[#666666] text-lg">
                  {selectedDate || selectedDept 
                    ? "No events found for your filters" 
                    : "No events found. Create the first event!"}
                </p>
                {(selectedDate || selectedDept) && (
                  <button
                    onClick={clearAllFilters}
                    className="mt-3 px-4 py-2 bg-[#533DDE] text-white rounded-xl hover:bg-[#311EAE] transition-colors"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Calendar Sidebar - Updated with exact navigation system from image */}
        <div className="hidden lg:block w-80 flex-shrink-0">
          <div className="bg-white rounded-2xl p-6 shadow-[0px_4px_20px_rgba(100,81,225,0.15)]">
            
            {/* BROWSE BY Section */}
            <div className="mb-8">
              <h2 className="text-[#533DDE] font-semibold text-lg mb-4">BROWSE BY</h2>
              
              {/* Month Navigation */}
              <div className="flex items-center justify-between mb-4">
                <button 
                  onClick={goToPreviousMonth}
                  className="text-[#533DDE] hover:text-[#311EAE] transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <h3 className="text-[#333333] font-semibold">
                  {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </h3>
                <button 
                  onClick={goToNextMonth}
                  className="text-[#533DDE] hover:text-[#311EAE] transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              {/* Calendar Grid */}
              <div className="mb-4">
                {/* Week Days Header */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                    <div key={day} className="text-center text-xs text-[#666666] font-medium py-1">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Days */}
                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map((day, index) => (
                    <button
                      key={index}
                      onClick={() => handleDateSelect(day)}
                      className={`h-8 rounded-lg text-sm font-medium transition-all ${
                        day
                          ? isToday(day)
                            ? 'bg-[#533DDE] text-white'
                            : isSelectedDate(day)
                            ? 'bg-[#ECE9FB] text-[#533DDE] border border-[#533DDE]'
                            : 'text-[#333333] hover:bg-[#F8F9FF]'
                          : ''
                      }`}
                      disabled={!day}
                    >
                      {day || ''}
                    </button>
                  ))}
                </div>
              </div>

              <div className="w-full h-px bg-[#ECE9FB] my-6"></div>
            </div>

            {/* INTERESTED IN Section */}
            <div>
              <h2 className="text-[#533DDE] font-semibold text-lg mb-4">INTERESTED IN</h2>
              
              <div className="space-y-4">
                {/* Event Item 1 */}
                <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#F8F9FF] transition-colors cursor-pointer">
                  <div className="flex flex-col items-center justify-center w-12 h-12 bg-[#533DDE] text-white rounded-lg flex-shrink-0">
                    <span className="text-xs font-bold">20</span>
                    <span className="text-xs">AUG</span>
                  </div>
                  <span className="text-[#333333] font-medium text-sm">Freshers Orientation...</span>
                </div>

                {/* Event Item 2 */}
                <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#F8F9FF] transition-colors cursor-pointer">
                  <div className="flex flex-col items-center justify-center w-12 h-12 bg-[#533DDE] text-white rounded-lg flex-shrink-0">
                    <span className="text-xs font-bold">03</span>
                    <span className="text-xs">SEP</span>
                  </div>
                  <span className="text-[#333333] font-medium text-sm">Programming C...</span>
                </div>

                {/* Event Item 3 */}
                <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#F8F9FF] transition-colors cursor-pointer">
                  <div className="flex flex-col items-center justify-center w-12 h-12 bg-[#533DDE] text-white rounded-lg flex-shrink-0">
                    <span className="text-xs font-bold">23</span>
                    <span className="text-xs">SEP</span>
                  </div>
                  <span className="text-[#333333] font-medium text-sm">Seminar on Artifi...</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Event Modal */}
      {showCreateEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-6xl">
            <CreateEvent
              onClose={() => setShowCreateEvent(false)}
              onAddEvent={(newEvent) => setEvents([newEvent, ...events])}
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md mx-auto p-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-[#333333] mb-2">
                Are you sure you want to delete this event?
              </h2>
              <p className="text-[#666666] mb-6">
                {deleteModal.eventTitle && (
                  <span className="font-medium">"{deleteModal.eventTitle}"</span>
                )}
                <br />
                Event will be permanently removed.
              </p>
              
              <div className="flex gap-4 justify-center">
                <button
                  onClick={closeDeleteModal}
                  className="px-6 py-3 bg-[#F8F9FF] text-[#533DDE] rounded-xl font-medium hover:bg-[#ECE9FB] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteEvent(deleteModal.eventId)}
                  className="px-6 py-3 bg-[#533DDE] text-white rounded-xl font-medium hover:bg-[#311EAE] transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventDashboard;