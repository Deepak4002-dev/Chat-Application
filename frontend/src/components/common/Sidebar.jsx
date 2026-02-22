import React from "react";
import { Link } from "react-router-dom";
import { User, Users, Search } from "lucide-react";

const Sidebar = () => {
  const Elements = [
    {
      name: "Friends",
      path: "friends",
      icon: <User size={20} />,
    },
    {
      name: "Groups",
      path: "group-chats",
      icon: <Users size={20} />,
    },
    {
      name: "Find",
      path: "find",
      icon: <Search size={20} />,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-gray-100 h-screen w-60 pt-3 shadow-lg">
      {/* Logo Section */}
      <div className="border-b border-black/10 pb-4">
        <Link
          to="/"
          className="flex flex-col items-center cursor-pointer select-none"
        >
          <h1 className="text-blue-600 font-semibold text-lg leading-none">
            AauChat
          </h1>
          <span className="text-gray-400 text-[13px] font-medium tracking-widest uppercase">
            Garau
          </span>
        </Link>
      </div>

      {/* Menu Items */}
      <div className="p-4 mt-8">
        <div className="flex flex-col gap-y-4">
          {Elements.map((element, id) => (
            <Link
              key={id}
              to={element.path}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-black hover:bg-gray-200 transition duration-200"
            >
              <span>{element.icon}</span>
              <span className="text-lg font-medium">{element.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
