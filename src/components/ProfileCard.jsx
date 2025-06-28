import React, { forwardRef, useImperativeHandle } from "react";
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

const ProfileCard = forwardRef(
  (
    {
      _id,
      firstName,
      lastName,
      name,
      age,
      gender,
      imgSrc,
      profilePic,
      distance,
      onOpenProfile,
      onButtonAction,
      about,
      skills,
    },
    ref
  ) => {
    // Handle connection request (interested or ignored)
    const handleConnectionRequest = async (status) => {
      if (!_id) return;
      try {
        await axios.post(
          `${BASE_URL}/connectionRequests/${status}/${_id}`,
          {},
          { withCredentials: true }
        );
        // After API success, trigger swipe animation in Feed
        if (onButtonAction) onButtonAction(status);
      } catch (err) {
        // Optionally show error feedback
        console.error("Connection request failed:", err);
      }
    };

    // Expose the API handler to parent via ref (for swipe)
    useImperativeHandle(ref, () => ({
      handleConnectionRequest,
    }));

    return (
      <div className="relative w-80 h-[500px] bg-black rounded-3xl shadow-2xl overflow-hidden flex flex-col justify-end select-none mx-auto outline-none border-1 border-gray-800 transition-colors duration-200">
        {/* Full background image */}
        <img
          className="absolute inset-0 w-full h-full object-cover z-0"
          src={imgSrc || profilePic}
          alt={`${firstName || name}'s profile`}
          draggable={false}
        />
        {/* Overlay for better text visibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10" />
        {/* Info Section at the bottom */}
        <div className="relative z-20 p-5 w-full">
          {/* Name, Age, Open Profile */}
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-white drop-shadow">
              {firstName || name}
              {age && <span className="font-normal text-gray-200"> {age}</span>}
              {gender && (
                <span className="text-sm text-gray-400 ml-2 capitalize">
                  {gender}
                </span>
              )}
            </h2>
            {onOpenProfile && (
              <button
                className="ml-auto bg-black/60 rounded-full p-1.5 text-white hover:bg-black/80 transition"
                title="Open Profile"
                onClick={onOpenProfile}
              >
                <FaArrowUp size={18} />
              </button>
            )}
          </div>
          {/* About */}
          {about && (
            <div className="mt-2 text-gray-300 text-sm line-clamp-2">
              {about}
            </div>
          )}
          {/* Skills */}
          {skills && Array.isArray(skills) && skills.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="bg-pink-600/20 text-pink-400 text-xs px-2 py-1 rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>
          )}
          {/* Distance */}
          {distance && (
            <div className="flex items-center gap-2 text-gray-200 text-sm mt-1">
              <FaMapMarkerAlt className="text-white/80" />
              <span>{distance}</span>
            </div>
          )}
          {/* Action Buttons */}
          <div className="flex justify-between mt-8 px-2">
            <button
              className="bg-gray-900 border-2 border-yellow-400 hover:bg-yellow-500/80 text-yellow-400 hover:text-white rounded-full w-12 h-12 flex items-center justify-center text-xl shadow transition duration-200 active:scale-90"
              aria-label="Rewind"
              // Optionally: add rewind logic
            >
              <FaUndo />
            </button>
            <button
              className="bg-gray-900 border-2 border-red-500 hover:bg-red-500 hover:text-white text-red-500 rounded-full w-12 h-12 flex items-center justify-center text-xl shadow transition duration-200 active:scale-90"
              aria-label="Nope"
              onClick={() => handleConnectionRequest("ignored")}
            >
              <FaTimes />
            </button>
            <button
              className="bg-gray-900 border-2 border-blue-500 hover:bg-blue-500 hover:text-white text-blue-500 rounded-full w-12 h-12 flex items-center justify-center text-xl shadow transition duration-200 active:scale-90"
              aria-label="Super Like"
              // Optionally: add super like logic
            >
              <FaStar />
            </button>
            <button
              className="bg-gray-900 border-2 border-green-500 hover:bg-green-500 hover:text-white text-green-500 rounded-full w-12 h-12 flex items-center justify-center text-xl shadow transition duration-200 active:scale-90"
              aria-label="Like"
              onClick={() => handleConnectionRequest("interested")}
            >
              <FaHeart />
            </button>
            <button
              className="bg-gray-900 border-2 border-blue-400 hover:bg-blue-400 hover:text-white text-blue-400 rounded-full w-12 h-12 flex items-center justify-center text-xl shadow transition duration-200 active:scale-90"
              aria-label="Send"
              // Optionally: add send logic
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
