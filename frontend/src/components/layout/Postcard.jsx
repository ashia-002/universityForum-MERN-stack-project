import React, { useState } from "react";
import api from "../../services/api.js";

const Postcard = ({
  id,
  title = "Untitled Post",
  author = { name: "Unknown", avatar: "/default-avatar.png", role: "N/A" },
  timeAgo = "Just now",
  tags = [],
  content = "",
  comments: initialComments = [],
  showCommentButton = true,
}) => {
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState(initialComments);
  const [loadingComment, setLoadingComment] = useState(false);
  const [loadingLike, setLoadingLike] = useState(false);
  const [loadingBookmark, setLoadingBookmark] = useState(false);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

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
      await api.post(`/post/${id}/like`);
      setLiked(!liked);
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
      await api.post(`/post/${id}/bookmark`);
      setBookmarked(!bookmarked);
    } catch (error) {
      console.error("Error bookmarking post:", error);
      alert(error.response?.data?.message || "Failed to bookmark post");
    } finally {
      setLoadingBookmark(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-[#ECE9FB] shadow-[0px_4px_20px_rgba(100,81,225,0.08)] p-6 mb-6 hover:shadow-[0px_6px_24px_rgba(100,81,225,0.15)] transition-shadow duration-300">
      {/* Title */}
      <h2 className="text-[22px] font-semibold text-[#333333] mb-4 leading-snug tracking-wide">
        {title}
      </h2>

      {/* Author Info with Profile */}
      <div className="flex items-center gap-3 mb-4">
        <img
          src={author.avatar || "/default-avatar.png"}
          alt={author.name}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="flex flex-col text-sm text-[#666666]">
          <span className="font-medium text-[#333333]">{author.name}</span>
          <div className="flex items-center gap-1 text-[#B3B3B3] text-xs">
            <span>{author.role}</span>
            <span>•</span>
            <span>{timeAgo}</span>
          </div>
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {tags.map((tag, i) => (
          <span
            key={i}
            className="px-3 py-1 bg-[#F4F2FF] text-[#533DDE] rounded-full text-sm font-medium"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Content */}
      <p className="text-[#666666] text-[15px] leading-relaxed tracking-wide mb-4 text-justify">
        {content}
      </p>

      {/* Actions: Like & Bookmark */}
      {showCommentButton && (
        <div className="flex items-center gap-2 mb-3">
          <button
            onClick={handleLikePost}
            disabled={loadingLike}
            className={`flex items-center gap-1 px-4 py-2 rounded-xl border border-[#ECE9FB] transition-colors ${
              liked ? "bg-[#533DDE] text-white" : "bg-white text-[#533DDE]"
            } hover:bg-[#7F6BE5] hover:text-white`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              fill={liked ? "white" : "currentColor"}
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
            <span className="text-sm font-medium">{liked ? "Liked" : "Like"}</span>
          </button>

          <button
            onClick={handleBookmarkPost}
            disabled={loadingBookmark}
            className={`flex items-center gap-1 px-4 py-2 rounded-xl border border-[#ECE9FB] transition-colors ${
              bookmarked ? "bg-[#533DDE] text-white" : "bg-white text-[#533DDE]"
            } hover:bg-[#7F6BE5] hover:text-white`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              fill={bookmarked ? "white" : "currentColor"}
              viewBox="0 0 24 24"
              stroke="none"
            >
              <path d="M6 2a2 2 0 0 0-2 2v18l8-4 8 4V4a2 2 0 0 0-2-2H6z" />
            </svg>
            <span className="text-sm font-medium">{bookmarked ? "Bookmarked" : "Bookmark"}</span>
          </button>
        </div>
      )}

      {/* Comment Input */}
      {showCommentButton && (
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 flex-1 bg-[#F4F4F5] rounded-xl px-3 py-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 text-[#999999]"
              fill="currentColor"
              viewBox="0 0 24 24"
              stroke="none"
            >
              <path d="M21 6h-2v9H5v2h16V6zM3 3v18l4-4h14V3H3z" />
            </svg>
            <input
              type="text"
              placeholder="Add a comment..."
              value={commentText}
              onChange={handleCommentChange}
              onKeyDown={handleEnterPress}
              disabled={loadingComment}
              className="w-full bg-transparent outline-none text-sm text-[#333333]"
            />
          </div>
          <button
            onClick={handleAddComment}
            disabled={loadingComment || !commentText.trim()}
            className="px-4 py-2 bg-[#533DDE] text-white rounded-xl hover:bg-[#7F6BE5] transition-colors text-sm"
          >
            {loadingComment ? "Posting..." : "Send"}
          </button>
        </div>
      )}

      {/* Comments List */}
      {comments.length > 0 && (
        <div className="mt-3 space-y-2">
          {comments.map((c) => (
            <div
              key={c._id || Math.random()}
              className="text-sm text-[#333333] border-b border-[#ECE9FB] pb-2"
            >
              <span className="font-medium">
                {typeof c.user === "object" ? c.user.name : c.user}:
              </span>{" "}
              <span>{c.text}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Postcard;
