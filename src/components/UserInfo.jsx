import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../appStore/userSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { FiZap, FiGrid, FiBook, FiShield, FiHeart } from "react-icons/fi";
import UserSentLikes from "./UserSentLikes";
import UsersConnections from "./UsersConnections";
import ReceivedReq from "./ReceivedReq";

const UserInfo = () => {
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.get(BASE_URL + "/logout", { withCredentials: true });
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <aside className="w-full h-full min-h-screen bg-[#18191c] flex flex-col shadow-xl overflow-hidden">
      {/* Top Bar */}
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
          >
            <FiHeart size={28} />
          </button>
          <button
            className="text-white hover:scale-110 transition"
            title="Explore"
          >
            <FiGrid size={28} />
          </button>
          <button
            className="text-white hover:scale-110 transition"
            title="Stories"
          >
            <FiBook size={28} />
          </button>
          <button
            className="text-white hover:scale-110 transition"
            title="Safety"
          >
            <FiShield size={28} />
          </button>
        </div>
      </div>
      {/* Tabs */}
      <div className="flex items-center justify-center gap-2 px-2 pt-6 bg-[#18191c]">
        <button className="block text-lg font-bold text-white border-b-2 border-orange-400 pb-1">
          Messages
        </button>
        <button className="block text-lg font-bold text-white border-b-2 border-transparent pb-1">
          My Connections
        </button>
        <button className="block text-lg font-bold text-white border-b-2 border-transparent pb-1">
          Friend Request
        </button>
      </div>
      <div>
        {/* <UserSentLikes /> */}
        <UsersConnections />
        <ReceivedReq />
      </div>

      {/* User Info & Settings at bottom */}
      <div className="px-8 pb-8 mt-auto">
        <div className="text-white text-xl font-bold mb-1">
          {user?.firstName} {user?.lastName}
        </div>
        <div className="text-orange-200 text-sm mb-2 capitalize">
          {user?.gender}{" "}
          {user?.age && <span className="ml-1">· {user.age}</span>}
        </div>
        <div className="text-gray-300 text-sm mb-4 opacity-80">
          {user?.about}
        </div>
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
