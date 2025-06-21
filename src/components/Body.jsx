import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { setUser } from "../appStore/userSlice";
import UserInfo from "./userInfo";
import Feed from "./Feed";

const Body = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fetchUser = async () => {
    try {
      const res = await axios.get(BASE_URL + "/profile/view", {
        withCredentials: true,
      });
      dispatch(setUser(res.data));
    } catch (error) {
      console.error("User fetch failed:", error);
      navigate("/login");
    }
  };

  useEffect(() => {
    fetchUser();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="w-full min-h-screen flex flex-col md:flex-row items-start justify-center gap-10   ">
      <aside className="w-full md:w-1/4 flex-shrink-0 flex justify-center md:justify-end mb-8 md:mb-0">
        <UserInfo />
      </aside>
      <main className="flex-1 flex justify-center items-start">
        <Feed />
      </main>
    </div>
  );
};

export default Body;
