// src/components/AdminLogin.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from "../assets/logo.png";

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Admin login submitted:', formData);
  };

  const handleUserLoginRedirect = () => navigate('/login');
  const handleSignUpRedirect = () => navigate('/signup');

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

      {/* User Login Button */}
      <button 
        onClick={handleUserLoginRedirect}
        className="absolute right-16 top-16 px-4 py-2 bg-[#ECE9FB] rounded-lg text-[#533DDE] font-medium text-lg hover:bg-[#E0DCF9] transition-colors"
      >
        User Login
      </button>

      {/* Center Background Logo */}
      <div className="absolute w-[251px] h-[251px] left-[248px] top-[415px]">
        <img src={logo} alt="Data Drop Background Logo" className="w-[235px] h-[235px] rounded-[44px] shadow-[0px_6px_30px_rgba(41,35,92,0.25)]" />
      </div>

      {/* Admin Login Card */}
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-full max-w-[855px] bg-white rounded-xl shadow-[0px_6px_18px_rgba(100,81,225,0.16)] p-12 ml-64">
          <div className="flex flex-col gap-8 w-full">
            <h2 className="text-4xl font-bold text-center text-[#333333] tracking-wide mb-4">
              Admin Login
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              {/* Username Field */}
              <div className="w-full h-14 bg-[#F2F2F2] rounded-lg px-4 flex items-center">
                <input
                  type="text"
                  name="username"
                  placeholder="Admin Name"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full bg-transparent outline-none text-[rgb(13,12,12)] font-medium text-lg placeholder-[#999999]"
                />
              </div>

              {/* Password Field with Show/Hide */}
              <div className="w-full h-14 bg-[#F2F2F2] rounded-lg px-4 flex items-center justify-between">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-transparent outline-none text-[#110f0f] font-medium text-lg placeholder-[#999999]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="ml-2 text-sm text-[#533DDE] font-medium"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between items-center pt-6">
                <button
                  type="button"
                  onClick={handleSignUpRedirect}
                  className="px-6 py-3 bg-[#ECE9FB] rounded-lg text-[#533DDE] font-medium text-lg hover:bg-[#E0DCF9] transition-colors"
                >
                  Don't have an account ?
                </button>
                
                <button
                  type="submit"
                  className="px-8 py-4 bg-[#533DDE] rounded-lg text-white font-medium text-lg hover:bg-[#311EAE] transition-colors min-w-[120px]"
                >
                  Log In
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom DATA DROP Text */}
      <div className="absolute w-[157px] h-[38px] left-[298px] top-[683px]">
        <h2 className="text-[25.4118px] leading-[38px] font-semibold tracking-[0.04em] text-[#311EAE]">
          DATA DROP
        </h2>
      </div>
    </div>
  );
};

export default AdminLogin;
