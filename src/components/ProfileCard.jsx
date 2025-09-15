import React, {
  forwardRef,
  useImperativeHandle,
  useCallback,
  useMemo,
} from "react";
import {
  FaUndo,
  FaTimes,
  FaStar,
  FaHeart,
  FaTelegramPlane,
  FaArrowUp,
  FaMapMarkerAlt,
} from "react-icons/fa";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

// Define default placeholder for profile pictures
const DEFAULT_PROFILE_PIC =
  "https://placehold.co/320x500/6b7280/ffffff?text=No+Image"; // A more generic placeholder

const ProfileCard = forwardRef(
  (
    {
      _id,
      firstName,
      lastName,
      name, // 'name' prop seems redundant if firstName/lastName are always available, but keeping for compatibility
      age,
      gender,
      imgSrc, // Primary image source
      profilePic, // Fallback image source
      distance,
      onOpenProfile, // Callback for opening full profile details
      onButtonAction, // Callback to trigger swipe animation in parent (Feed)
      about,
      skills, // Expected to be an array
      isActive = true, // New prop to control interactivity, defaults to true
    },
    ref
  ) => {
    // Memoize image and name to avoid unnecessary recalculations
    const displayImage = useMemo(
      () => imgSrc || profilePic || DEFAULT_PROFILE_PIC,
      [imgSrc, profilePic]
    );
    const displayName = useMemo(() => {
      if (firstName && lastName) return `${firstName} ${lastName}`;
      return firstName || lastName || name || "Unknown User";
    }, [firstName, lastName, name]);

    // Handle connection request (like/ignore)
    const handleConnectionRequest = useCallback(
      async (status) => {
        // Prevent action if card is not active or no ID is present
        if (!isActive || !_id) return;

        try {
          // Send connection request to backend
          await axios.post(
            `${BASE_URL}/connectionRequests/${status}/${_id}`,
            {}, // Empty body for POST request
            { withCredentials: true }
          );

          // After successful API call, trigger the swipe animation in the parent component
          if (onButtonAction) {
            onButtonAction(status);
          }
        } catch (err) {
          // Log error and optionally provide user feedback (e.g., a toast notification)
          console.error("Connection request failed:", err);
          // TODO: Implement user-facing error notification here
        }
      },
      [_id, isActive, onButtonAction] // Dependencies for useCallback
    );

    // Expose the handleConnectionRequest function to the parent component via ref
    // This allows the parent (Feed) to programmatically trigger a swipe
    useImperativeHandle(ref, () => ({
      handleConnectionRequest,
    }));

    // Keyboard accessibility: allow Enter/Space to trigger Like/Nope
    const handleKeyDown = (e) => {
      if (!isActive) return;
      if (e.key === "ArrowLeft") handleConnectionRequest("ignored");
      if (e.key === "ArrowRight") handleConnectionRequest("interested");
    };

    return (
      <div
        className={`relative w-80 h-[500px] bg-gray-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col justify-end select-none mx-auto outline-none transition-all duration-300 ease-in-out
          ${
            isActive
              ? "border-2 border-pink-500"
              : "border-2 border-gray-700 opacity-80"
          }
        `}
        // Add aria-hidden when not active for accessibility
        aria-hidden={!isActive}
        tabIndex={isActive ? 0 : -1}
        role="region"
        aria-label={`Profile card for ${displayName}`}
        onKeyDown={handleKeyDown}
      >
        {/* Full background image */}
        <img
          className="absolute inset-0 w-full h-full object-cover z-0"
          src={displayImage}
          alt={`${displayName}'s profile picture`}
          draggable={false} // Prevent image dragging
          onError={(e) => {
            // Fallback for broken images
            e.target.onerror = null; // Prevent infinite loop
            e.target.src = DEFAULT_PROFILE_PIC;
            e.target.classList.add("object-contain", "bg-gray-700"); // Adjust styling for fallback
          }}
        />
        {/* Overlay for better text visibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10" />

        {/* Info Section at the bottom */}
        <div className="relative z-20 p-5 w-full">
          {/* Name, Age, Gender, Open Profile Button */}
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-white drop-shadow">
              {displayName}
              {age && (
                <span className="font-normal text-gray-200 ml-2">{age}</span>
              )}
              {gender && (
                <span className="text-sm text-gray-400 ml-2 capitalize">
                  {gender}
                </span>
              )}
            </h2>
            {onOpenProfile && (
              <button
                className={`ml-auto bg-black/60 rounded-full p-2 text-white hover:bg-black/80 transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50
                  ${!isActive && "opacity-50 cursor-not-allowed"}
                `}
                title="Open Profile"
                onClick={onOpenProfile}
                disabled={!isActive} // Disable button if card is not active
                aria-label={`Open full profile for ${displayName}`}
                tabIndex={isActive ? 0 : -1}
              >
                <FaArrowUp size={18} />
              </button>
            )}
          </div>

          {/* About Section */}
          {about && (
            <p className="mt-2 text-gray-300 text-sm line-clamp-2">{about}</p>
          )}

          {/* Skills Section */}
          {skills && Array.isArray(skills) && skills.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="bg-pink-600/20 text-pink-300 text-xs px-2.5 py-1 rounded-full font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          )}

          {/* Distance Section */}
          {distance && (
            <div className="flex items-center gap-2 text-gray-200 text-sm mt-3">
              <FaMapMarkerAlt className="text-pink-400" />{" "}
              {/* Changed icon color */}
              <span>{distance}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between mt-8 px-2">
            {/* Rewind Button (Example - not hooked up to logic) */}
            <button
              className={`bg-gray-900 border-2 border-yellow-400 hover:bg-yellow-500/80 text-yellow-400 hover:text-white rounded-full w-12 h-12 flex items-center justify-center text-xl shadow-lg transition duration-200 active:scale-90
                ${!isActive && "opacity-50 cursor-not-allowed"}
              `}
              aria-label="Rewind"
              disabled={!isActive}
              title="Rewind"
              tabIndex={isActive ? 0 : -1}
            >
              <FaUndo />
            </button>

            {/* Nope Button */}
            <button
              className={`bg-gray-900 border-2 border-red-500 hover:bg-red-500 hover:text-white text-red-500 rounded-full w-16 h-16 flex items-center justify-center text-3xl shadow-lg transition duration-200 active:scale-90
                ${!isActive && "opacity-50 cursor-not-allowed"}
              `}
              aria-label="Nope"
              onClick={() => handleConnectionRequest("ignored")}
              disabled={!isActive}
              title="Nope"
              tabIndex={isActive ? 0 : -1}
            >
              <FaTimes />
            </button>

            {/* Super Like Button (Example - not hooked up to logic) */}
            <button
              className={`bg-gray-900 border-2 border-blue-500 hover:bg-blue-500 hover:text-white text-blue-500 rounded-full w-12 h-12 flex items-center justify-center text-xl shadow-lg transition duration-200 active:scale-90
                ${!isActive && "opacity-50 cursor-not-allowed"}
              `}
              aria-label="Super Like"
              disabled={!isActive}
              title="Super Like"
              tabIndex={isActive ? 0 : -1}
            >
              <FaStar />
            </button>

            {/* Like Button */}
            <button
              className={`bg-gray-900 border-2 border-green-500 hover:bg-green-500 hover:text-white text-green-500 rounded-full w-16 h-16 flex items-center justify-center text-3xl shadow-lg transition duration-200 active:scale-90
                ${!isActive && "opacity-50 cursor-not-allowed"}
              `}
              aria-label="Like"
              onClick={() => handleConnectionRequest("interested")}
              disabled={!isActive}
              title="Like"
              tabIndex={isActive ? 0 : -1}
            >
              <FaHeart />
            </button>

            {/* Send Button (Example - not hooked up to logic) */}
            <button
              className={`bg-gray-900 border-2 border-blue-400 hover:bg-blue-400 hover:text-white text-blue-400 rounded-full w-12 h-12 flex items-center justify-center text-xl shadow-lg transition duration-200 active:scale-90
                ${!isActive && "opacity-50 cursor-not-allowed"}
              `}
              aria-label="Send Message"
              disabled={!isActive}
              title="Send Message"
              tabIndex={isActive ? 0 : -1}
            >
              <FaTelegramPlane />
            </button>
          </div>
        </div>
      </div>
    );
  }
);

export default ProfileCard;
