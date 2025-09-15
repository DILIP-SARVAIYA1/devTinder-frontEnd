import React, { useState, useCallback } from "react";
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

  const [activeTab, setActiveTab] = useState("messages");
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [logoutError, setLogoutError] = useState("");

  const handleLogout = useCallback(async () => {
    setLogoutLoading(true);
    setLogoutError("");
    try {
      await axios.get(BASE_URL + "/logout", { withCredentials: true });
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      setLogoutError("Logout failed. Please try again.");
      console.error("Logout failed:", error);
    } finally {
      setLogoutLoading(false);
    }
  }, [dispatch, navigate]);

  const renderContent = () => {
    switch (activeTab) {
      case "messages":
        return <UserSentLikes />;
      case "connections":
        return <UsersConnections />;
      case "requests":
        return <ReceivedReq />;
      default:
        return <UserSentLikes />;
    }
  };

  return (
    <aside
      className="w-full h-full min-h-screen bg-[#18191c] flex flex-col shadow-xl"
      aria-label="Sidebar with user info and navigation"
    >
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
                draggable={false}
              />
            </div>
            <span className="text-white font-semibold text-lg">
              {user?.firstName || "You"}
            </span>
          </div>
          <div className="flex-1 flex justify-end gap-6">
            <button
              className={`text-white hover:scale-110 transition focus:outline-none ${
                activeTab === "messages" ? "opacity-100" : "opacity-70"
              }`}
              title="Likes"
              aria-label="Show Likes"
              tabIndex={0}
              onClick={() => setActiveTab("messages")}
            >
              <FiHeart size={28} />
            </button>
            <button
              className="text-white hover:scale-110 transition focus:outline-none opacity-70"
              title="Explore"
              aria-label="Explore"
              tabIndex={0}
              // Add navigation if needed
            >
              <FiGrid size={28} />
            </button>
            <button
              className="text-white hover:scale-110 transition focus:outline-none opacity-70"
              title="Stories"
              aria-label="Stories"
              tabIndex={0}
              // Add navigation if needed
            >
              <FiBook size={28} />
            </button>
            <button
              className="text-white hover:scale-110 transition focus:outline-none opacity-70"
              title="Safety"
              aria-label="Safety"
              tabIndex={0}
              // Add navigation if needed
            >
              <FiShield size={28} />
            </button>
          </div>
        </div>

        {/* Tabs for Navigation */}
        <div className="flex items-center justify-between text-md gap-2 px-2 py-2">
          <button
            className={`block text-md font-bold text-white pb-1 focus:outline-none ${
              activeTab === "messages"
                ? "border-b-2 border-orange-400"
                : "border-b-2 border-transparent opacity-70"
            }`}
            aria-label="Messages"
            tabIndex={0}
            onClick={() => setActiveTab("messages")}
          >
            Messages
          </button>
          <button
            className={`block font-bold text-white pb-1 focus:outline-none ${
              activeTab === "connections"
                ? "border-b-2 border-orange-400"
                : "border-b-2 border-transparent opacity-70"
            }`}
            aria-label="My Connections"
            tabIndex={0}
            onClick={() => setActiveTab("connections")}
          >
            My Connections
          </button>
          <button
            className={`block font-bold text-white pb-1 focus:outline-none ${
              activeTab === "requests"
                ? "border-b-2 border-orange-400"
                : "border-b-2 border-transparent opacity-70"
            }`}
            aria-label="Friend Requests"
            tabIndex={0}
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
        {logoutError && (
          <div className="text-red-500 text-sm mb-2">{logoutError}</div>
        )}
        <div className="flex gap-2">
          <button
            className="flex-1 py-2 rounded-xl bg-pink-600/90 text-white font-semibold hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
            onClick={() => navigate("/settings")}
            aria-label="Settings"
            tabIndex={0}
          >
            Settings
          </button>
          <button
            className="flex-1 py-2 rounded-xl bg-gray-800/90 text-white font-semibold hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400 transition"
            onClick={() => navigate("/profile")}
            aria-label="Edit Profile"
            tabIndex={0}
          >
            Edit Profile
          </button>
          <button
            className="flex-1 py-2 rounded-xl bg-orange-500/90 text-white font-semibold hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400 transition disabled:opacity-60"
            onClick={handleLogout}
            aria-label="Logout"
            tabIndex={0}
            disabled={logoutLoading}
          >
            {logoutLoading ? "Logging out..." : "Logout"}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default UserInfo;
