// src/components/GlobalLayout.jsx
import React from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./layout/Navbar"; // your existing sidebar/navbar
import ProfileNavbar from "./layout/ProfileNavbar"; // new profile navbar

const GlobalLayout = ({ children }) => {
  const location = useLocation();

  // Define routes where navbar should be hidden
  const noNavbarRoutes = ["/login", "/signup", "/admin-login"];

  // Check if current route is profile page
  const isProfilePage = location.pathname === "/profile";

  return (
    <div className="app-container flex flex-col md:flex-row min-h-screen">
      {/* Show appropriate navbar based on route */}
      {!noNavbarRoutes.includes(location.pathname) && (
        isProfilePage ? (
          <ProfileNavbar />
        ) : (
          <Navbar />
        )
      )}

      {/* Main content area - unchanged */}
      <main className="flex-1 p-4 md:p-6">{children}</main>
    </div>
  );
};

export default GlobalLayout;