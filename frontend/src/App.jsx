import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SignUp from './components/SignUp';
import Login from './components/Login';
import AdminLogin from './components/AdminLogin';
import Navbar from './components/layout/Navbar';
import Dashboard from './components/layout/Dashboard';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Auth Routes (without navbar) */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          
          {/* Main App Routes (with navbar) */}
          <Route path="/dashboard" element={
            <div className="flex">
              <Navbar />
              <Dashboard />
            </div>
          } />
          
          {/* Additional protected routes */}
          <Route path="/explore" element={
            <div className="flex">
              <Navbar />
              <div className="flex-1 p-8 bg-[#FAF9FF] min-h-screen">
                <h1 className="text-2xl font-bold text-[#180F57]">Explore Page</h1>
                <p className="text-[#666666]">Coming soon...</p>
              </div>
            </div>
          } />
          
          <Route path="/my-community" element={
            <div className="flex">
              <Navbar />
              <div className="flex-1 p-8 bg-[#FAF9FF] min-h-screen">
                <h1 className="text-2xl font-bold text-[#180F57]">My Community</h1>
                <p className="text-[#666666]">Coming soon...</p>
              </div>
            </div>
          } />
          
          <Route path="/events" element={
            <div className="flex">
              <Navbar />
              <div className="flex-1 p-8 bg-[#FAF9FF] min-h-screen">
                <h1 className="text-2xl font-bold text-[#180F57]">Events</h1>
                <p className="text-[#666666]">Coming soon...</p>
              </div>
            </div>
          } />
          
          <Route path="/announcements" element={
            <div className="flex">
              <Navbar />
              <div className="flex-1 p-8 bg-[#FAF9FF] min-h-screen">
                <h1 className="text-2xl font-bold text-[#180F57]">Announcements</h1>
                <p className="text-[#666666]">Coming soon...</p>
              </div>
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;