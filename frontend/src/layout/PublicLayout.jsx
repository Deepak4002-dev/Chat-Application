import React from "react";
import Navbar from "../components/common/Navbar";
import { Outlet } from "react-router-dom";

const PublicLayout = () => {
  return (
    <div className="w-full min-h-screen">
      <Navbar />
      <Outlet />
    </div>
  );
};

export default PublicLayout;
