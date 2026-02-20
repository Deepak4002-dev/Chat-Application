import React from "react";

const AdminLayout = () => {
  return (
    <div className="w-full min-h-screen">
      <Navbar />
      <Outlet />
    </div>
  );
};

export default AdminLayout;
