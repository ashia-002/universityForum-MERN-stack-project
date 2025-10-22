// src/components/SignUp.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import api from "../services/api.js";

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    department_id: "",
    role: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showDepartmentDropdown, setShowDepartmentDropdown] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingDepartments, setLoadingDepartments] = useState(true);

  const navigate = useNavigate();
  const deptRef = useRef(null);
  const roleRef = useRef(null);

  // Fetch departments from backend
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await api.get("/get/department");
        const data = response.data;
        if (Array.isArray(data)) setDepartments(data);
      } catch (error) {
        console.error("Error fetching departments:", error);
      } finally {
        setLoadingDepartments(false);
      }
    };
    fetchDepartments();
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (deptRef.current && !deptRef.current.contains(event.target)) {
        setShowDepartmentDropdown(false);
      }
      if (roleRef.current && !roleRef.current.contains(event.target)) {
        setShowRoleDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.role ||
      !formData.department_id
    ) {
      alert("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      await api.post("/auth/register", formData);
      alert("Registration successful!");
      navigate("/login");
    } catch (error) {
      console.error("Registration error:", error);
      alert(error.response?.data?.message || "Failed to register");
    } finally {
      setLoading(false);
    }
  };

  const handleRoleSelect = (role) => {
    setFormData({ ...formData, role });
    setShowRoleDropdown(false);
  };

  const handleDepartmentSelect = (dept) => {
    setFormData({ ...formData, department_id: dept._id });
    setShowDepartmentDropdown(false);
  };

  const handleLoginRedirect = () => navigate("/login");
  const handleAdminRedirect = () => navigate("/admin-login");

  return (
    <div className="min-h-screen bg-[#FAF9FF] font-poppins relative overflow-hidden">
      {/* Background Blur Effects */}
      <div className="absolute w-[203px] h-[203px] left-[119px] top-[489px] bg-[#8B7CE9] blur-[100px]"></div>
      <div className="absolute w-[111px] h-[111px] left-[455px] top-[350px] bg-[#6451E1] blur-[100px]"></div>

      {/* Logo Section */}
      <div className="absolute left-16 top-12 flex items-center gap-3">
        <img src={logo} alt="Data Drop Logo" className="w-14 h-14 object-contain rounded-lg" />
        <div className="flex flex-col">
          <h1 className="text-[#180F57] font-semibold text-xl tracking-wide">DATA DROP</h1>
          <p className="text-[#666666] text-lg">RPSU Forum</p>
        </div>
      </div>

      {/* Admin Button */}
      <button
        onClick={handleAdminRedirect}
        className="absolute right-16 top-16 px-4 py-2 bg-[#ECE9FB] rounded-lg text-[#533DDE] font-medium text-lg hover:bg-[#E0DCF9] transition-colors"
      >
        Admin?
      </button>

      {/* Center Background Logo */}
      <div className="absolute w-[251px] h-[251px] left-[248px] top-[415px]">
        <img
          src={logo}
          alt="Data Drop Background Logo"
          className="w-[235px] h-[235px] rounded-[44px] shadow-[0px_6px_30px_rgba(41,35,92,0.25)]"
        />
      </div>

      {/* Signup Form */}
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-full max-w-[855px] bg-white rounded-xl shadow-[0px_6px_18px_rgba(100,81,225,0.16)] p-12 ml-64">
          <div className="flex flex-col gap-8 w-full">
            <h2 className="text-4xl font-bold text-center text-[#333333] tracking-wide mb-4">
              Register as a user
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              {/* Full Name */}
              <div className="w-full h-14 bg-[#F2F2F2] rounded-lg px-4 flex items-center">
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-transparent outline-none text-[#333333] font-medium text-lg placeholder-[#999999]"
                />
              </div>

              {/* Email */}
              <div className="w-full h-14 bg-[#F2F2F2] rounded-lg px-4 flex items-center">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-transparent outline-none text-[#333333] font-medium text-lg placeholder-[#999999]"
                />
              </div>

              {/* Password */}
              <div className="w-full h-14 bg-[#F2F2F2] rounded-lg px-4 flex items-center justify-between">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-transparent outline-none text-[#333333] font-medium text-lg placeholder-[#999999]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="ml-2 text-sm text-[#533DDE] font-medium"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              {/* Department Dropdown */}
              <div className="relative" ref={deptRef}>
                <div
                  className="w-full h-14 bg-[#F2F2F2] rounded-lg px-4 flex items-center justify-between cursor-pointer hover:bg-[#E8E8E8] transition-colors"
                  onClick={() => setShowDepartmentDropdown(!showDepartmentDropdown)}
                >
                  <span
                    className={`font-medium text-lg ${
                      formData.department_id ? "text-[#333333]" : "text-[#999999]"
                    }`}
                  >
                    {loadingDepartments
                      ? "Loading..."
                      : departments.find((d) => d._id === formData.department_id)?.name ||
                        "Select Department"}
                  </span>
                  <div className="w-6 h-6 flex items-center justify-center">
                    <div
                      className={`w-2 h-2 border-r-2 border-b-2 border-[#333333] transform ${
                        showDepartmentDropdown
                          ? "rotate-225 translate-y-[1px]"
                          : "rotate-45 translate-y-[-1px]"
                      } transition-transform`}
                    ></div>
                  </div>
                </div>

                {showDepartmentDropdown && departments.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-[0px_6px_18px_rgba(100,81,225,0.16)] z-10 overflow-hidden">
                    {departments.map((dept) => (
                      <div
                        key={dept._id}
                        className="px-4 py-3 hover:bg-[#ECE9FB] cursor-pointer transition-colors border-b border-gray-100"
                        onClick={() => handleDepartmentSelect(dept)}
                      >
                        {dept.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Role Dropdown */}
              <div className="relative" ref={roleRef}>
                <div
                  className="w-full h-14 bg-[#F2F2F2] rounded-lg px-4 flex items-center justify-between cursor-pointer hover:bg-[#E8E8E8] transition-colors"
                  onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                >
                  <span
                    className={`font-medium text-lg ${
                      formData.role ? "text-[#333333]" : "text-[#999999]"
                    }`}
                  >
                    {formData.role || "Select Role"}
                  </span>
                  <div className="w-6 h-6 flex items-center justify-center">
                    <div
                      className={`w-2 h-2 border-r-2 border-b-2 border-[#333333] transform ${
                        showRoleDropdown
                          ? "rotate-225 translate-y-[1px]"
                          : "rotate-45 translate-y-[-1px]"
                      } transition-transform`}
                    ></div>
                  </div>
                </div>

                {showRoleDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-[0px_6px_18px_rgba(100,81,225,0.16)] z-10 overflow-hidden">
                    <div
                      className="px-4 py-3 hover:bg-[#ECE9FB] cursor-pointer transition-colors border-b border-gray-100"
                      onClick={() => handleRoleSelect("teacher")}
                    >
                      Teacher
                    </div>
                    <div
                      className="px-4 py-3 hover:bg-[#ECE9FB] cursor-pointer transition-colors"
                      onClick={() => handleRoleSelect("student")}
                    >
                      Student
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex justify-between items-center pt-6">
                <button
                  type="button"
                  onClick={handleLoginRedirect}
                  className="px-6 py-3 bg-[#ECE9FB] rounded-lg text-[#533DDE] font-medium text-lg hover:bg-[#E0DCF9] transition-colors"
                >
                  Already have an account?
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-4 bg-[#533DDE] rounded-lg text-white font-medium text-lg hover:bg-[#311EAE] transition-colors min-w-[120px]"
                >
                  {loading ? "Registering..." : "Sign Up"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Text */}
      <div className="absolute w-[157px] h-[38px] left-[298px] top-[683px]">
        <h2 className="text-[25.4118px] leading-[38px] font-semibold tracking-[0.04em] text-[#311EAE]">
          DATA DROP
        </h2>
      </div>
    </div>
  );
};

export default SignUp;
