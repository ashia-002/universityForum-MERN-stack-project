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
  const [currentMonth, setCurrentMonth] = useState(new Date()); // ✅ Added: Current month state

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [eventsRes, deptRes] = await Promise.all([
          api.get("/event/all-events"),
          api.get("/get/department"),
        ]);
        
        console.log("Events API Response:", eventsRes.data);
        
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
    const dept = departments.find((d) => d._id === id);
    return dept ? dept.name : "Unknown Department";
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

  // Filter & sort events
  const filteredEvents = events
    .filter((event) => {
      // Department filter
      const departmentMatch = selectedDept ? event.department_id === selectedDept : true;
      
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

  // Clear date filter
  const clearDateFilter = () => {
    setSelectedDate("");
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

          {/* Filter & Sort - RESPONSIVE BUTTONS */}
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

            {/* Responsive Sort Buttons */}
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

          {/* Date Filter Info */}
          {selectedDate && (
            <div className="flex items-center gap-2 bg-[#F8F9FF] rounded-xl p-3">
              <span className="text-sm text-[#533DDE]">
                Showing events for: {dayjs(selectedDate).format('MMMM D, YYYY')}
              </span>
              <button
                onClick={clearDateFilter}
                className="text-[#666] hover:text-[#333] text-sm"
              >
                ✕
              </button>
            </div>
          )}

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
                    getDepartmentName(event.department_id),
                  ]}
                  initialComments={event.comments || []}
                  attendees={event.attendees || []}
                  image={event.image}
                  likes={event.likes || []}
                  interestedUsers={event.interestedUsers || event.attendees || []}
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
                    onClick={() => {
                      setSelectedDate("");
                      setSelectedDept("");
                    }}
                    className="mt-3 px-4 py-2 bg-[#533DDE] text-white rounded-xl hover:bg-[#311EAE] transition-colors"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Event Navigation Sidebar */}
        <div className="hidden lg:block w-80 flex-shrink-0">
          <div className="space-y-6">
            {/* BROWSE BY Section - NOW WITH DYNAMIC CALENDAR */}
            <div className="bg-white rounded-2xl p-6 shadow-[0px_4px_20px_rgba(100,81,225,0.15)]">
              <h2 className="text-xl font-bold text-[#333333] mb-2">BROWSE BY</h2>
              
              {/* Month Navigation */}
              <div className="flex justify-between items-center mb-4">
                <button 
                  onClick={goToPreviousMonth}
                  className="p-2 hover:bg-[#F8F9FF] rounded-lg transition-colors"
                >
                  <svg className="w-4 h-4 text-[#533DDE]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <h3 className="text-lg font-semibold text-[#533DDE]">
                  {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </h3>
                <button 
                  onClick={goToNextMonth}
                  className="p-2 hover:bg-[#F8F9FF] rounded-lg transition-colors"
                >
                  <svg className="w-4 h-4 text-[#533DDE]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
              
              {/* Calendar Grid */}
              <div className="mb-6">
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                    <div key={day} className="text-center text-xs font-medium text-[#666666] py-1">
                      {day}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map((day, index) => (
                    <div
                      key={index}
                      onClick={() => handleDateSelect(day)}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium cursor-pointer transition-colors ${
                        !day 
                          ? "invisible"
                          : isSelectedDate(day)
                          ? "bg-[#533DDE] text-white"
                          : isToday(day)
                          ? "bg-[#ECE9FB] text-[#533DDE] border border-[#533DDE]"
                          : "bg-[#F8F9FF] text-[#333333] hover:bg-[#ECE9FB]"
                      }`}
                    >
                      {day}
                    </div>
                  ))}
                </div>
              </div>

              {/* Date Input for Custom Date Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-[#666666] mb-2">
                  Or select specific date:
                </label>
                <input
                  type="date"
                  value={selectedDate ? dayjs(selectedDate).format('YYYY-MM-DD') : ''}
                  onChange={(e) => setSelectedDate(e.target.value ? new Date(e.target.value).toISOString() : '')}
                  className="w-full h-10 bg-[#F8F9FF] border border-[#E3E0F9] rounded-xl px-3 outline-none focus:ring-2 focus:ring-[#533DDE] text-[#333]"
                />
              </div>

              {selectedDate && (
                <button
                  onClick={clearDateFilter}
                  className="w-full py-2 bg-[#ECE9FB] text-[#533DDE] rounded-xl font-medium hover:bg-[#E0DCF9] transition-colors"
                >
                  Clear Date Filter
                </button>
              )}

              <div className="border-t border-[#ECE9FB] my-4"></div>

              {/* INTERESTED IN Section - TEMPORARILY DISABLED */}
              <h3 className="text-lg font-semibold text-[#333333] mb-4">INTERESTED IN</h3>
              <div className="space-y-3">
                <div className="text-center py-4">
                  <p className="text-sm text-[#666666]">No events marked as interested yet</p>
                  <p className="text-xs text-[#999] mt-1">Click "Interested" on events to see them here</p>
                </div>
              </div>
            </div>

            {/* Additional Event Card Preview */}
            <div className="bg-white rounded-2xl p-6 shadow-[0px_4px_20px_rgba(100,81,225,0.15)]">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-3 py-1 bg-[#F8F9FF] text-[#533DDE] rounded-full text-xs font-medium">
                  Event
                </span>
                <span className="text-[#666666] text-sm">(Department)</span>
              </div>
              <h3 className="font-semibold text-[#333333] mb-2">Join to welcome our Coding Champions</h3>
              <p className="text-sm text-[#666666]">CSE</p>
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
    </div>
  );
};

export default EventDashboard;