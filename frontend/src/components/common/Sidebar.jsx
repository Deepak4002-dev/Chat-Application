import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="fixed inset-0 z-50 bg-gray-100 h-screen w-60 pt-5 ">
      <div>
        {/* Logo Section */}
        <Link
          to="/"
          className="flex flex-col items-center cursor-pointer select-none"
        >
          <h1 className="text-blue-600 font-[600] text-lg leading-none">
            AauChat
          </h1>
          <span className="text-gray-400 text-[13px] font-medium tracking-widest uppercase">
            Garau
          </span>
        </Link>
      </div>

      <div></div>
    </div>
  );
};

export default Sidebar;
