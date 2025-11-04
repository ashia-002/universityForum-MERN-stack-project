import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import AdminLogin from "./components/AdminLogin";
import Dashboard from "./components/layout/Dashboard";
import GlobalLayout from "./components/GlobalLayout";
import CommunitiesDashboard from "./components/layout/CommunitiesDashboard";
import EventDashboard from "./components/layout/EventDashboard"; // ✅ Import EventDashboard
import ViewCommunity from "./components/layout/ViewCommunity"; // ✅ Import ViewCommunity

function App() {
  return (
    <Router>
      <Routes>
        {/* Auth Routes (without navbar) */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/admin-login" element={<AdminLogin />} />

        {/* Main App Routes (with navbar & global layout) */}
        <Route
          path="/dashboard"
          element={
            <GlobalLayout>
              <Dashboard />
            </GlobalLayout>
          }
        />

        <Route
          path="/explore"
          element={
            <GlobalLayout>
              <div className="flex-1 p-8 bg-[#FAF9FF] min-h-screen">
                <h1 className="text-2xl font-bold text-[#180F57]">Explore Page</h1>
                <p className="text-[#666666]">Coming soon...</p>
              </div>
            </GlobalLayout>
          }
        />

        {/* ✅ Communities Dashboard Route */}
        <Route
          path="/my-community"
          element={
            <GlobalLayout>
              <CommunitiesDashboard />
            </GlobalLayout>
          }
        />

        {/* ✅ ViewCommunity Route */}
        <Route
          path="/community/:communityId"
          element={
            <GlobalLayout>
              <ViewCommunity />
            </GlobalLayout>
          }
        />

        {/* ✅ EventDashboard Route */}
        <Route
          path="/events"
          element={
            <GlobalLayout>
              <EventDashboard />
            </GlobalLayout>
          }
        />

        <Route
          path="/announcements"
          element={
            <GlobalLayout>
              <div className="flex-1 p-8 bg-[#FAF9FF] min-h-screen">
                <h1 className="text-2xl font-bold text-[#180F57]">Announcements</h1>
                <p className="text-[#666666]">Coming soon...</p>
              </div>
            </GlobalLayout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;