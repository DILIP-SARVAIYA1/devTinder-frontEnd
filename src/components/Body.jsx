import React from "react";
import UserInfo from "./userInfo";
import ProfileData from "./ProfileData";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";

const Body = () => {
  return (
    <div className="flex">
      <UserInfo />
      <ProfileData />
    </div>
  );
};

export default Body;
