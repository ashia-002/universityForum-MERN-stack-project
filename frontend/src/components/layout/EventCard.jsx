// src/components/layout/EventCard.jsx - Fixed with proper keys
import React, { useState } from "react";
import api from "../../services/api";
import dayjs from "dayjs";

const EventCard = ({
  id,
  title,
  description,
  venue,
  date,
  author,
  role,
  timeAgo,
  tags,
  initialComments = [],
  attendees = [],
  image,
  likes = [],
  interestedUsers = []
}) => {
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState("");
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isInterested, setIsInterested] = useState(interestedUsers.length > 0);
  const [isLiked, setIsLiked] = useState(likes.length > 0);
  const [loading, setLoading] = useState({ 
    interested: false, 
    like: false, 
    comment: false 
  });

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      try {
        setLoading(prev => ({ ...prev, comment: true }));
        
        // Try to send comment to backend
        try {
          console.log("Sending comment to:", `/event/${id}/comment`);
          console.log("Comment text:", newComment.trim());
          
          const response = await api.post(`/event/${id}/comment`, {
            text: newComment.trim() // ✅ Changed from 'content' to 'text'
          });

          console.log("Comment API response:", response.data);
          
          // Add the new comment to the local state with the response data
          const newCommentData = response.data.comment || response.data || {
            _id: Date.now().toString(),
            content: newComment.trim(),
            created_by: response.data.user || { name: "You" },
            createdAt: new Date().toISOString(),
          };
          
          setComments([...comments, newCommentData]);
          console.log("Comment added successfully via API");
          
        } catch (apiError) {
          console.error("Comment API failed:", apiError);
          console.error("API error details:", apiError.response?.data);
          
          // Check if it's a 400 error with specific message
          if (apiError.response?.data?.msg) {
            alert(`Comment failed: ${apiError.response.data.msg}`);
          } else {
            // Fallback: Add comment locally
            const fallbackComment = {
              _id: Date.now().toString(),
              content: newComment.trim(),
              created_by: { name: "You" },
              createdAt: new Date().toISOString(),
            };
            
            setComments([...comments, fallbackComment]);
            console.log("Comment added locally as fallback");
          }
        }
        
        setNewComment("");
        
      } catch (error) {
        console.error("Unexpected error adding comment:", error);
        alert("Failed to add comment");
      } finally {
        setLoading(prev => ({ ...prev, comment: false }));
      }
    }
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const handleInterest = async () => {
    try {
      setLoading(prev => ({ ...prev, interested: true }));
      
      if (isInterested) {
        setIsInterested(false);
      } else {
        const response = await api.post(`/event/${id}/interested`);
        setIsInterested(true);
        console.log("Marked as interested:", response.data);
      }
    } catch (error) {
      console.error("Error marking as interested:", error);
      alert(error.response?.data?.msg || "Failed to mark as interested");
      setIsInterested(!isInterested);
    } finally {
      setLoading(prev => ({ ...prev, interested: false }));
    }
  };

  const handleLike = async () => {
    try {
      setLoading(prev => ({ ...prev, like: true }));
      
      if (isLiked) {
        setIsLiked(false);
      } else {
        const response = await api.post(`/event/${id}/like`);
        setIsLiked(true);
        console.log("Liked event:", response.data);
      }
    } catch (error) {
      console.error("Error liking event:", error);
      alert(error.response?.data?.msg || "Failed to like event");
      setIsLiked(!isLiked);
    } finally {
      setLoading(prev => ({ ...prev, like: false }));
    }
  };

  const formatEventDate = (dateString) => {
    if (!dateString) return "Date not specified";
    return dayjs(dateString).format("MMMM D, YYYY [at] h:mm A");
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-[0px_4px_20px_rgba(100,81,225,0.15)]">
      {/* Event Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-[#F8F9FF] text-[#533DDE] rounded-full text-xs font-medium">
            Event
          </span>
          <span className="text-[#666666] text-sm">({tags[1] || "Whole Varsity"})</span>
        </div>
      </div>

      {/* Event Image */}
      {image && (
        <div className="mb-4">
          <img 
            src={image} 
            alt={title}
            className="w-full h-48 object-cover rounded-xl"
            onError={(e) => {
              console.log("Image failed to load:", image);
              e.target.style.display = 'none';
            }}
          />
        </div>
      )}

      {/* Event Title */}
      <h1 className="text-2xl font-bold text-[#333333] mb-2">
        {title}
      </h1>

      {/* Author Info */}
      <div className="flex items-center gap-2 text-sm text-[#666666] mb-4">
        <span className="font-medium">{author}</span>
        <span>•</span>
        <span>{timeAgo}</span>
        <span>•</span>
        <span>{role}</span>
      </div>

      {/* Event Description */}
      <p className="text-[#666666] mb-6 leading-relaxed">
        {description}
      </p>

      {/* Divider */}
      <div className="border-t border-[#ECE9FB] my-6"></div>

      {/* Event Details */}
      <div className="mb-6">
        <div className="space-y-2 text-[#333333]">
          {venue && (
            <p className="font-medium">{venue}</p>
          )}
          {date && (
            <p className="text-[#666666]">{formatEventDate(date)}</p>
          )}
        </div>
      </div>

      {/* Action Buttons and Comment Input */}
      <div className="flex items-center gap-3">
        {/* Like Button */}
        <button
          onClick={handleLike}
          disabled={loading.like}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-colors ${
            isLiked
              ? "bg-[#533DDE] text-white"
              : "bg-[#F8F9FF] text-[#533DDE] hover:bg-[#ECE9FB]"
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <svg 
            className="w-4 h-4" 
            fill={isLiked ? "currentColor" : "none"} 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" 
            />
          </svg>
          Like
        </button>

        {/* Interested Button */}
        <button
          onClick={handleInterest}
          disabled={loading.interested}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-colors ${
            isInterested
              ? "bg-[#533DDE] text-white"
              : "bg-[#F8F9FF] text-[#533DDE] hover:bg-[#ECE9FB]"
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {loading.interested ? "..." : "Interested"}
        </button>

        {/* Comment Input */}
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 h-12 bg-[#F8F9FF] border border-[#E3E0F9] rounded-xl px-4 outline-none focus:ring-2 focus:ring-[#533DDE] text-[#333]"
            disabled={loading.comment}
          />
          <button
            onClick={handleAddComment}
            disabled={!newComment.trim() || loading.comment}
            className="px-6 h-12 bg-[#533DDE] text-white rounded-xl font-medium hover:bg-[#311EAE] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading.comment ? "..." : "Post"}
          </button>
        </div>
      </div>

      {/* Comments Section */}
      {comments.length > 0 && (
        <div className="mt-4 border-t border-[#ECE9FB] pt-4">
          <div className="space-y-3">
            {comments.map((comment) => (
              <div 
                key={comment._id || comment.id || `comment-${Date.now()}-${Math.random()}`} // ✅ Fixed: Proper unique key
                className="flex gap-3"
              >
                <div className="w-8 h-8 bg-[#533DDE] rounded-full flex items-center justify-center text-white text-xs font-semibold">
                  {comment.created_by?.name?.charAt(0)?.toUpperCase() || "U"}
                </div>
                <div className="flex-1">
                  <div className="bg-[#F8F9FF] rounded-xl p-3">
                    <p className="font-medium text-[#333333]">{comment.created_by?.name || "User"}</p>
                    <p className="text-[#666666]">{comment.content || comment.text}</p>
                  </div>
                  <p className="text-xs text-[#999] mt-1">
                    {dayjs(comment.createdAt).fromNow()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EventCard;