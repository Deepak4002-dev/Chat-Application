import React from "react";
import { Outlet } from "react-router-dom";

import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { getMe } from "../rtk/auth/authAsyncThunk";
import Sidebar from "../components/common/Sidebar";
import Navbar from "../components/user/Navbar";

const UserLayout = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getMe());
  }, []);

  return (
    <div className="w-screen min-h-screen">
      <div className="w-full h-full flex">
        <div className="ml-60">
          <Sidebar />
        </div>
        <div className="flex flex-col flex-1">
          <Navbar />

          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default UserLayout;
