// src/components/layout/CommunitiesDashboard.jsx
import React, { useState } from "react";

const CommunitiesDashboard = () => {
  const categories = [
    "All",
    "Cultural",
    "Academic",
    "Register",
    "Library",
    "Admission",
    "Department",
  ];

  const [activeCategory, setActiveCategory] = useState("All");

  const communities = [
    {
      id: 1,
      name: "CSE_Debate",
      members: 608,
      description:
        "Engage in a meaningful brawling with opposite minded friends",
      joined: true,
    },
    {
      id: 2,
      name: "CSE_Debate",
      members: 608,
      description:
        "Engage in a meaningful brawling with opposite minded friends",
      joined: false,
    },
    {
      id: 3,
      name: "CSE_Debate",
      members: 608,
      description:
        "Engage in a meaningful brawling with opposite minded friends",
      joined: true,
    },
    {
      id: 4,
      name: "CSE_Debate",
      members: 608,
      description:
        "Engage in a meaningful brawling with opposite minded friends",
      joined: false,
    },
    {
      id: 5,
      name: "CSE_Debate",
      members: 608,
      description:
        "Engage in a meaningful brawling with opposite minded friends",
      joined: true,
    },
    {
      id: 6,
      name: "CSE_Debate",
      members: 608,
      description:
        "Engage in a meaningful brawling with opposite minded friends",
      joined: true,
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF9FF] font-poppins">
      <div
        className={`pt-32 px-4 sm:px-6 md:px-8 lg:px-10 flex flex-col gap-6 transition-all duration-300 ${
          window.innerWidth >= 1024 ? "ml-80" : ""
        }`}
      >
        {/* Title */}
        <h1 className="text-3xl font-extrabold text-[#180F57] mb-6">
          My Communities
        </h1>

        {/* Category Buttons */}
        <div className="flex flex-wrap gap-4 mb-6">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-2 rounded-md text-[16px] font-medium border transition-all duration-200
                ${
                  activeCategory === category
                    ? "bg-[#5E43F3] text-white border-[#5E43F3]" // 🔹 dark purple when active
                    : "bg-[#ECE6FF] text-[#5E43F3] border-[#D6CCFF] hover:bg-[#D6CCFF]" // 🔸 light purple by default
                }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Grid of Communities */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-10">
          {communities.map((community) => (
            <div
              key={community.id}
              className="bg-white rounded-xl border border-[#E6E6E6] shadow-md p-5 flex flex-col justify-between hover:shadow-lg transition"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h2 className="text-lg font-semibold text-[#180F57]">
                    {community.name}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {community.members} members
                  </p>
                </div>
                <button
                  className={`px-4 py-1 border rounded-lg text-sm font-medium ${
                    community.joined
                      ? "border-[#9C89FF] text-[#5E43F3] bg-[#F8F6FF]"
                      : "border-[#D9D9D9] text-gray-600 hover:border-[#5E43F3]"
                  }`}
                >
                  {community.joined ? "Joined" : "Join"}
                </button>
              </div>
              <p className="text-gray-700 text-sm leading-snug">
                {community.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CommunitiesDashboard;
