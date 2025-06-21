import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../appStore/userSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

const UserInfo = () => {
  const user = useSelector((state) => state.user.userData);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const res = await axios.get(BASE_URL + "/logout", {
        withCredentials: true,
      });
      if (res.status === 200) {
        console.log("Logout successful");
      } else {
        console.error("Logout failed with status:", res.status);
      }
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <aside className="w-full h-full min-h-screen bg-gradient-to-br from-gray-900 via-pink-900 to-pink-700 flex flex-col rounded-3xl shadow-xl overflow-hidden">
      {/* Navbar */}
      <div className="flex items-center justify-between px-6 py-4 bg-gray-900/80 border-b border-pink-800">
        <div className="flex items-center gap-3 justify-center">
          <span className="text-xl font-bold text-white tracking-wide">
            devTinder
          </span>
          <div className="w-12 h-12 rounded-full border-1 border-pink-400 shadow-lg overflow-hidden mb-3">
            <img
              src={
                user?.profilePic ||
                "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
              }
              alt="User avatar"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="text-sm text-pink-300 hover:text-white transition font-semibold"
          title="Logout"
        >
          Logout
        </button>
      </div>
      {/* User Info */}
      <div className="flex flex-col items-center px-6 py-8 flex-1">
        <div className="text-2xl font-bold text-white mb-1">
          {user?.firstName} {user?.lastName}
        </div>
        <div className="text-pink-200 text-sm mb-2 capitalize">
          {user?.gender}{" "}
          {user?.age && <span className="ml-1">· {user.age}</span>}
        </div>
        <div className="text-gray-200 text-center text-sm mb-4 opacity-80">
          {user?.about}
        </div>
        {user?.skills && user.skills.length > 0 && (
          <div className="flex flex-wrap gap-2 justify-center mb-4">
            {user.skills.map((skill, idx) => (
              <span
                key={idx}
                className="bg-pink-200/80 text-pink-800 px-3 py-1 rounded-full text-xs font-semibold shadow"
              >
                {skill}
              </span>
            ))}
          </div>
        )}
        <div className="w-full border-t border-pink-800 my-4"></div>
        {/* Settings */}
        <div className="flex flex-col gap-2 w-full">
          <button
            className="w-full py-2 rounded-xl bg-pink-600/80 text-white font-semibold hover:bg-pink-700 transition"
            onClick={() => navigate("/settings")}
          >
            Settings
          </button>
          <button
            className="w-full py-2 rounded-xl bg-gray-800/80 text-white font-semibold hover:bg-gray-900 transition"
            onClick={() => navigate("/profile")}
          >
            Edit Profile
          </button>
        </div>
      </div>
    </aside>
  );
};

export default UserInfo;
