// src/components/GlobalLayout.jsx
import React from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./layout/Navbar"; // your existing sidebar/navbar

const GlobalLayout = ({ children }) => {
  const location = useLocation();

  // Define routes where navbar should be hidden
  const noNavbarRoutes = ["/login", "/signup", "/admin-login"];

  return (
    <div className="app-container flex flex-col md:flex-row min-h-screen">
      {/* Show navbar only if current route is not in noNavbarRoutes */}
      {!noNavbarRoutes.includes(location.pathname) && <Navbar />}

      {/* Main content area */}
      <main className="flex-1 p-4 md:p-6">{children}</main>
    </div>
  );
};

export default GlobalLayout;
