// src/components/layout/PostCard.jsx
import React, { useState } from "react";
import api from "../../services/api.js";

const Postcard = ({
  id,
  title = "Untitled Post",
  author = { name: "Unknown", avatar: "/default-avatar.png", role: "N/A" },
  timeAgo = "Just now",
  tags = [],
  content = "",
  image = "", // Add image prop
  comments: initialComments = [],
  showCommentButton = true,
  type = "post", // "post" or "announcement"
  onDelete, // Callback when post is deleted - should open confirmation modal
  onEdit // Callback when post is edited
}) => {
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState(initialComments);
  const [loadingComment, setLoadingComment] = useState(false);
  const [loadingLike, setLoadingLike] = useState(false);
  const [loadingBookmark, setLoadingBookmark] = useState(false);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const handleCommentChange = (e) => setCommentText(e.target.value);

  const handleAddComment = async () => {
    if (!commentText.trim()) return;

    try {
      setLoadingComment(true);
      const endpoint = type === "announcement" 
        ? `/announcement/${id}/comment` 
        : `/post/${id}/comment`;
      
      const response = await api.post(endpoint, { text: commentText });
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
      const endpoint = type === "announcement" 
        ? `/announcement/${id}/like` 
        : `/post/${id}/like`;
      
      await api.post(endpoint);
      setLiked(!liked);
    } catch (error) {
      console.error("Error liking:", error);
      alert(error.response?.data?.message || `Failed to like ${type}`);
    } finally {
      setLoadingLike(false);
    }
  };

  const handleBookmarkPost = async () => {
    try {
      setLoadingBookmark(true);
      
      // For posts - use the original endpoint
      if (type === "post") {
        await api.post(`/post/${id}/bookmark`);
        setBookmarked(!bookmarked);
        return;
      }
      
      // For announcements - try multiple endpoint approaches
      console.log(`Attempting to bookmark announcement ${id}`);
      
      // Try the documented endpoint first
      try {
        await api.post(`/announcement/bookmark/${id}`);
        setBookmarked(!bookmarked);
        console.log("Bookmark successful with primary endpoint");
        return;
      } catch (primaryError) {
        console.log("Primary endpoint failed, trying alternatives...");
        
        // Alternative 1: Try with announcementId in request body
        try {
          await api.post("/announcement/bookmark", { announcementId: id });
          setBookmarked(!bookmarked);
          console.log("Bookmark successful with alternative endpoint (body)");
          return;
        } catch (alt1Error) {
          console.log("Alternative 1 failed, trying next...");
          
          // Alternative 2: Try different endpoint structure
          try {
            await api.post(`/announcement/${id}/bookmark`);
            setBookmarked(!bookmarked);
            console.log("Bookmark successful with alternative endpoint (path)");
            return;
          } catch (alt2Error) {
            console.log("All bookmark endpoints failed");
            throw primaryError; // Throw the original error
          }
        }
      }
      
    } catch (error) {
      console.error("Error bookmarking:", error);
      
      // Detailed error logging for debugging
      if (error.response) {
        console.error("Response status:", error.response.status);
        console.error("Response data:", error.response.data);
      }
      
      alert(error.response?.data?.message || `Failed to bookmark ${type}`);
    } finally {
      setLoadingBookmark(false);
    }
  };

  // Updated: Remove the internal confirm and directly call onDelete
  const handleDeletePost = () => {
    // Simply call the onDelete callback - Dashboard will handle the confirmation
    if (onDelete) {
      onDelete(id);
    }
    setShowMenu(false);
  };

  const handleEditPost = () => {
    // Call the onEdit callback if provided
    if (onEdit) {
      onEdit(id);
    }
    setShowMenu(false);
  };

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  // Close menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (showMenu && !event.target.closest('.post-menu')) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  return (
    <div className="bg-white rounded-2xl border border-[#ECE9FB] shadow-[0px_4px_20px_rgba(100,81,225,0.08)] p-6 mb-6 hover:shadow-[0px_6px_24px_rgba(100,81,225,0.15)] transition-shadow duration-300 relative">
      {/* Three-dot menu button */}
      <div className="absolute top-4 right-4 post-menu">
        <button
          onClick={toggleMenu}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
        >
          <svg
            className="w-5 h-5 text-gray-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
          </svg>
        </button>

        {/* Dropdown menu */}
        {showMenu && (
          <div className="absolute right-0 top-10 bg-white rounded-lg shadow-lg border border-gray-200 py-2 w-40 z-10">
            <button
              onClick={handleEditPost}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Post
            </button>
            <button
              onClick={handleDeletePost}
              className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete Post
            </button>
          </div>
        )}
      </div>

      {/* Title */}
      <h2 className="text-[22px] font-semibold text-[#333333] mb-4 leading-snug tracking-wide pr-10">
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

      {/* Image Display */}
      {image && (
        <div className="mb-4">
          <img 
            src={image} 
            alt="Post image" 
            className="w-full max-w-md mx-auto rounded-lg object-cover max-h-80"
            onError={(e) => {
              console.log("Image failed to load:", image);
              e.target.style.display = 'none';
            }}
          />
        </div>
      )}

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