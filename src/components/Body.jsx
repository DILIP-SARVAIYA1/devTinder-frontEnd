import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { setUser } from "../appStore/userSlice";
import Feed from "./Feed";
import UserInfo from "./userInfo";

const Body = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(BASE_URL + "/profile/view", {
          withCredentials: true,
        });
        dispatch(setUser(res.data.data));
      } catch (error) {
        console.error("User fetch failed:", error);
        // Only navigate if not already on /login
        if (window.location.pathname !== "/login") {
          navigate("/login", { replace: true });
        }
      }
    };
    fetchUser();
    // eslint-disable-next-line
  }, [dispatch, navigate]);

  return (
    <div className="w-full bg-black text-white min-h-screen flex flex-col md:flex-row items-start justify-center">
      <aside className="w-full md:w-1/4 flex-shrink-0 flex justify-center md:justify-end mb-8 md:mb-0 h-screen overflow-y-auto">
        <UserInfo />
      </aside>
      <main className="flex-1 flex justify-center items-start h-screen overflow-y-auto">
        <Feed />
      </main>
    </div>
  );
};

export default Body;
