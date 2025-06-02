import React from "react";
import UserInfo from "./userInfo";
import ProfileData from "./ProfileData";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";

const Body = () => {
  return (
    <div className="">
      <Outlet />
    </div>
  );
};

export default Body;
