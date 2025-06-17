import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { setUser } from "../appStore/userSlice";

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
  }, []);

  return (
    <div className="min-h-screen ">
      <Outlet />
    </div>
  );
};

export default Body;
