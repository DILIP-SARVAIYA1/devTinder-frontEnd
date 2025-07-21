import React, { useState } from "react"; // Import useState for managing active tab
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../appStore/userSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { FiGrid, FiBook, FiShield, FiHeart } from "react-icons/fi";
import UserSentLikes from "./UserSentLikes";
import UsersConnections from "./UsersConnections";
import ReceivedReq from "./ReceivedReq";

const UserInfo = () => {
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // State to manage which tab is active
  const [activeTab, setActiveTab] = useState("messages"); // 'messages', 'connections', 'requests'

  const handleLogout = async () => {
    try {
      await axios.get(BASE_URL + "/logout", { withCredentials: true });
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      // Optionally, display an error message to the user
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "messages":
        return <UserSentLikes />; // Assuming UserSentLikes is relevant for 'messages' or sent likes
      case "connections":
        return <UsersConnections />;
      case "requests":
        return <ReceivedReq />;
      default:
        return <UserSentLikes />; // Default to messages or sent likes
    }
  };

  return (
    <aside className="w-full h-full min-h-screen bg-[#18191c] flex flex-col shadow-xl">
      <div className="sticky top-0 z-20 bg-[#18191c] border-b border-gray-800">
        {/* Top Bar: User Info & Quick Actions */}
        <div className="flex items-center px-6 py-4 bg-gradient-to-r from-pink-500 via-orange-400 to-orange-500">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full border-2 border-white overflow-hidden">
              <img
                src={
                  user?.profilePic ||
                  "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                }
                alt="User avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-white font-semibold text-lg">You</span>
          </div>
          <div className="flex-1 flex justify-end gap-6">
            <button
              className="text-white hover:scale-110 transition"
              title="Likes"
              onClick={() => setActiveTab("messages")} // Example: clicking Likes icon could show sent likes
            >
              <FiHeart size={28} />
            </button>
            <button
              className="text-white hover:scale-110 transition"
              title="Explore"
              // Add actual navigation or action for explore
            >
              <FiGrid size={28} />
            </button>
            <button
              className="text-white hover:scale-110 transition"
              title="Stories"
              // Add actual navigation or action for stories
            >
              <FiBook size={28} />
            </button>
            <button
              className="text-white hover:scale-110 transition"
              title="Safety"
              // Add actual navigation or action for safety
            >
              <FiShield size={28} />
            </button>
          </div>
        </div>

        {/* Tabs for Navigation */}
        <div className="flex items-center justify-between text-md gap-2 px-2 py-2">
          <button
            className={`block text-md font-bold text-white pb-1 ${
              activeTab === "messages"
                ? "border-b-2 border-orange-400"
                : "border-b-2 border-transparent"
            }`}
            onClick={() => setActiveTab("messages")}
          >
            Messages
          </button>
          <button
            className={`block font-bold text-white pb-1 ${
              activeTab === "connections"
                ? "border-b-2 border-orange-400"
                : "border-b-2 border-transparent"
            }`}
            onClick={() => setActiveTab("connections")}
          >
            My Connections
          </button>
          <button
            className={`block font-bold text-white pb-1 ${
              activeTab === "requests"
                ? "border-b-2 border-orange-400"
                : "border-b-2 border-transparent"
            }`}
            onClick={() => setActiveTab("requests")}
          >
            Friend Requests
          </button>
        </div>
      </div>

      {/* Dynamic Content Area based on Active Tab */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {renderContent()}
      </div>

      {/* User Skills and Actions at Bottom */}
      <div className="px-8 pb-8 mt-auto">
        {user?.skills && user.skills.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {user.skills.map((skill, idx) => (
              <span
                key={idx}
                className="bg-orange-200/80 text-orange-800 px-3 py-1 rounded-full text-xs font-semibold shadow"
              >
                {skill}
              </span>
            ))}
          </div>
        )}
        <div className="flex gap-2">
          <button
            className="flex-1 py-2 rounded-xl bg-pink-600/90 text-white font-semibold hover:bg-pink-700 transition"
            onClick={() => navigate("/settings")}
          >
            Settings
          </button>
          <button
            className="flex-1 py-2 rounded-xl bg-gray-800/90 text-white font-semibold hover:bg-gray-900 transition"
            onClick={() => navigate("/profile")}
          >
            Edit Profile
          </button>
          <button
            className="flex-1 py-2 rounded-xl bg-orange-500/90 text-white font-semibold hover:bg-orange-600 transition"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
};

export default UserInfo;
