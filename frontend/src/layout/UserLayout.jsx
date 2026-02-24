import { Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getMe } from "../rtk/auth/authAsyncThunk";
import Sidebar from "../components/common/Sidebar";
import Navbar from "../components/user/Navbar";
import { connectSocket, disconnectSocket } from "../rtk/socket/socketThunk";

const UserLayout = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getMe());
  }, []);

  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user?._id) {
      dispatch(connectSocket(user._id));
    }
    return () => dispatch(disconnectSocket());
  }, [user?._id]);

  return (
    <div className="w-screen min-h-screen">
      <div className="w-full h-full flex">
        <div className="ml-60">
          <Sidebar />
        </div>
        <div className="flex flex-col flex-1 h-screen overflow-hidden">
          <Navbar />
          <div className="flex-1 h-auto overflow-y-auto">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserLayout;
