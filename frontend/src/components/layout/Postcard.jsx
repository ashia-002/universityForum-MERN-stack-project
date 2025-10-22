import React, { useState } from "react";
import api from "../../services/api.js";

const Postcard = ({
  id, // post ID needed for comments, likes, bookmarks
  title = "Date of the final exams",
  author = "Dr. Ronald Jackson",
  timeAgo = "3d ago",
  role = "Teacher",
  tags = ["Post", "Department", "CSE"],
  content = "Hand rib pepperoni thin and rib steak ranch...",
  showCommentButton = true,
}) => {
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]); 
  const [loadingComment, setLoadingComment] = useState(false);
  const [loadingLike, setLoadingLike] = useState(false);
  const [loadingBookmark, setLoadingBookmark] = useState(false);

  const handleCommentChange = (e) => setCommentText(e.target.value);

  const handleAddComment = async () => {
    if (!commentText.trim()) return;

    try {
      setLoadingComment(true);
      const response = await api.post(`/post/${id}/comment`, { text: commentText });
      setComments(response.data.comments || []);
      setCommentText("");
    } catch (error) {
      console.error("Error adding comment:", error);
      alert(error.response?.data?.message || "Failed to add comment");
    } finally {
      setLoadingComment(false);
    }
  };

  const handleEnterPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddComment();
    }
  };

  const handleLikePost = async () => {
    try {
      setLoadingLike(true);
      await api.post(`/post/${id}/like`, { text: "" }); 
      alert("You liked this post!");
    } catch (error) {
      console.error("Error liking post:", error);
      alert(error.response?.data?.message || "Failed to like post");
    } finally {
      setLoadingLike(false);
    }
  };

  const handleBookmarkPost = async () => {
    try {
      setLoadingBookmark(true);
      await api.post(`/post/${id}/bookmark`, { text: "" }); 
      alert("Post bookmarked!");
    } catch (error) {
      console.error("Error bookmarking post:", error);
      alert(error.response?.data?.message || "Failed to bookmark post");
    } finally {
      setLoadingBookmark(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-[#ECE9FB] shadow-[0px_4px_20px_rgba(100,81,225,0.08)] p-8 mb-8 hover:shadow-[0px_6px_24px_rgba(100,81,225,0.15)] transition-shadow duration-300">

      {/* Title */}
      <h2 className="text-[22px] font-semibold text-[#333333] mb-3 leading-snug tracking-wide">
        {title}
      </h2>

      {/* Author Info */}
      <div className="flex flex-wrap items-center gap-2 text-sm text-[#666666] mb-5">
        <span className="font-medium">{author}</span>
        <span className="text-[#B3B3B3]">•</span>
        <span>{role}</span>
        <span className="text-[#B3B3B3]">•</span>
        <span>{timeAgo}</span>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-3 mb-6">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="px-4 py-2 bg-[#F4F2FF] text-[#533DDE] rounded-full text-sm font-medium"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Content */}
      <p className="text-[#666666] text-[15px] leading-relaxed tracking-wide mb-6 text-justify">
        {content}
      </p>

      {/* Divider + Action Buttons */}
      {showCommentButton && (
        <div className="border-t border-[#ECE9FB] pt-5 flex items-center gap-3">
          
          {/* Purple Love Button */}
          <button
            onClick={handleLikePost}
            disabled={loadingLike}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-[#533DDE] hover:bg-[#7F6BE5] transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
              stroke="none"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 
                       3 7.5 3c1.74 0 3.41 0.81 4.5 
                       2.09C13.09 3.81 14.76 3 16.5 
                       3 19.58 3 22 5.42 22 8.5c0 
                       3.78-3.4 6.86-8.55 11.54L12 
                       21.35z" />
            </svg>
          </button>

          {/* Purple Bookmark Button */}
          <button
            onClick={handleBookmarkPost}
            disabled={loadingBookmark}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-[#533DDE] hover:bg-[#7F6BE5] transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
              stroke="none"
            >
              <path d="M6 2a2 2 0 0 0-2 2v18l8-4 8 4V4a2 2 0 0 0-2-2H6z" />
            </svg>
          </button>

          {/* Add Comment Input Field */}
          <input
            type="text"
            placeholder="Add a comment..."
            value={commentText}
            onChange={handleCommentChange}
            onKeyDown={handleEnterPress}
            className="flex-1 h-10 px-4 rounded-full border border-[#ECE9FB] focus:outline-none focus:ring-2 focus:ring-[#533DDE] text-sm"
            disabled={loadingComment}
          />

          {/* Send Button */}
          <button
            onClick={handleAddComment}
            disabled={loadingComment || !commentText.trim()}
            className="px-4 py-2 bg-[#533DDE] text-white rounded-full hover:bg-[#7F6BE5] transition-colors text-sm"
          >
            {loadingComment ? "Posting..." : "Send"}
          </button>
        </div>
      )}

      {/* Display comments */}
      {comments.length > 0 && (
        <div className="mt-4 space-y-2">
          {comments.map((c) => (
            <div key={c._id} className="text-sm text-[#333] border-b border-[#ECE9FB] pb-2">
              <span className="font-medium">{c.user}: </span>
              <span>{c.text}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Postcard;
