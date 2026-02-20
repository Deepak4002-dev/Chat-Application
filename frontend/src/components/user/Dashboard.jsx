import React from "react";
import { useSelector } from "react-redux";

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  return (
    <div className="flex justify-center items-center">
      <h1 className="text-2xl text-blue-600">Welcome {user.username}</h1>
    </div>
  );
};

export default Dashboard;
