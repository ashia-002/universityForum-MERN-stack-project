import React from 'react';

const PostCard = ({ 
  title = "Date of the final exams",
  author = "Dr Ronald Jackson",
  timeAgo = "3d ago",
  role = "Teacher",
  tags = ["Post", "Department", "CSE"],
  content = "Hand rib pepperoni thin and rib steak ranch. Pork banana rib cheese sautéed olives buffalo deep pork bell. And marinara cheese melted red mozzarella crust ham cheese olives. Aussie ham ipsum pie wing. Deep marinara mayo broccoli meatball burnt marinara. Fresh pineapple olives Hawaiian onions ricotta meat party green.",
  showCommentButton = true
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-[0px_4px_20px_rgba(100,81,225,0.15)] p-8 mb-6">
      {/* Post Title */}
      <h2 className="text-xl font-semibold text-[#333333] mb-4 tracking-wide">
        {title}
      </h2>
      
      {/* Author Info */}
      <div className="flex items-center gap-3 text-sm text-[#666666] mb-4">
        <span className="font-medium">{author}</span>
        <span>|</span>
        <span>{timeAgo}</span>
        <span>|</span>
        <span>{role}</span>
      </div>
      
      {/* Tags */}
      <div className="flex gap-3 mb-6">
        {tags.map((tag, index) => (
          <span 
            key={index}
            className="px-4 py-2 bg-[#ECE9FB] text-[#533DDE] rounded-full text-sm font-medium tracking-wide"
          >
            {tag}
          </span>
        ))}
      </div>
      
      {/* Content */}
      <div className="mb-6">
        <p className="text-[#666666] leading-relaxed tracking-wide text-justify">
          {content}
        </p>
      </div>
      
      {/* Add Comment Button */}
      {showCommentButton && (
        <div className="flex items-center gap-3 pt-4 border-t border-[#ECE9FB]">
          <div className="w-5 h-5 border-2 border-[#533DDE] rounded-sm flex items-center justify-center">
            {/* Empty checkbox */}
          </div>
          <button className="text-[#533DDE] font-medium hover:text-[#311EAE] transition-colors text-sm tracking-wide">
            Add a comment
          </button>
        </div>
      )}
    </div>
  );
};

export default PostCard;