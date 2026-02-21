// import React from "react";
// import { Link } from "react-router-dom";

// const Sidebar = () => {
//   return (
//     <div className="fixed inset-0 z-50 bg-gray-100 h-screen w-60 pt-5 ">
//       <div className="border-b border-black/10 pt-1.5 ">
//         {/* Logo Section */}
//         <Link
//           to="/"
//           className="flex flex-col items-center cursor-pointer select-none"
//         >
//           <h1 className="text-blue-600 font-[600] text-lg leading-none">
//             AauChat
//           </h1>
//           <span className="text-gray-400 text-[13px] font-medium tracking-widest uppercase">
//             Garau
//           </span>
//         </Link>
//       </div>

//       <div className="flex justify-around mt-2 ">
//         <button className="px-4 py-1 bg-white text-black rounded-md">
//           Home
//         </button>
//         <button className="px-4 py-1 bg-white text-black rounded-md">
//           Friends
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Sidebar;

// import React, { useState } from "react";
// import { Link } from "react-router-dom";

// const Sidebar = () => {
//   const [activeTab, setActiveTab] = useState("home");

//   return (
//     <div className="fixed inset-0 z-50 bg-gray-100 h-screen w-60 pt-5">
//       {/* Logo Section */}
//       <div className="border-b border-black/10 pt-1.5 pb-3">
//         <Link
//           to="/"
//           className="flex flex-col items-center cursor-pointer select-none"
//         >
//           <h1 className="text-blue-600 font-[600] text-lg leading-none">
//             AauChat
//           </h1>
//           <span className="text-gray-400 text-[13px] font-medium tracking-widest uppercase">
//             Garau
//           </span>
//         </Link>
//       </div>

//       {/* Tabs */}
//       <div className="flex justify-around mt-3">
//         <button
//           onClick={() => setActiveTab("home")}
//           className={`px-4 py-1 rounded-md ${
//             activeTab === "home"
//               ? "bg-blue-500 text-white"
//               : "bg-white text-black"
//           }`}
//         >
//           Home
//         </button>

//         <button
//           onClick={() => setActiveTab("friends")}
//           className={`px-4 py-1 rounded-md ${
//             activeTab === "friends"
//               ? "bg-blue-500 text-white"
//               : "bg-white text-black"
//           }`}
//         >
//           Friends
//         </button>
//       </div>

//       {/* Dynamic Content */}
//       <div className="mt-5 px-3">
//         {activeTab === "home" && (
//           <div>
//             <h3 className="text-sm font-semibold mb-3">Friend Suggestions</h3>

//             <div className="space-y-2">
//               <div className="flex items-center gap-2 bg-white p-2 rounded">
//                 <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
//                 <span>John Doe</span>
//               </div>

//               <div className="flex items-center gap-2 bg-white p-2 rounded">
//                 <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
//                 <span>Emma Watson</span>
//               </div>
//             </div>
//           </div>
//         )}

//         {activeTab === "friends" && (
//           <div>
//             <h3 className="text-sm font-semibold mb-3">Your Friends</h3>

//             <div className="space-y-2">
//               <div className="flex items-center gap-2 bg-white p-2 rounded">
//                 <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
//                 <span>Michael</span>
//               </div>

//               <div className="flex items-center gap-2 bg-white p-2 rounded">
//                 <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
//                 <span>Sophia</span>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Sidebar;

import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const [activeTab, setActiveTab] = useState("home");
  const location = useLocation();

  const linkClass = (path) =>
    `block px-4 py-2 rounded-md text-sm font-medium transition ${
      location.pathname === path
        ? "bg-blue-500 text-white"
        : "text-gray-700 hover:bg-gray-200"
    }`;

  return (
    <div className="fixed inset-y-0 left-0 z-50 bg-gray-100 h-screen w-60 pt-5 border-r">
      {/* Logo Section */}
      <div className="border-b border-black/10 pt-1.5 pb-3">
        <Link
          to="/dashboard"
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

      {/* Top Tabs */}
      <div className="flex justify-around mt-4 px-2">
        <button
          onClick={() => setActiveTab("home")}
          className={`px-4 py-1 rounded-md text-sm ${
            activeTab === "home"
              ? "bg-blue-500 text-white"
              : "bg-white text-black"
          }`}
        >
          Home
        </button>

        <button
          onClick={() => setActiveTab("chats")}
          className={`px-4 py-1 rounded-md text-sm ${
            activeTab === "chats"
              ? "bg-blue-500 text-white"
              : "bg-white text-black"
          }`}
        >
          Chats
        </button>
      </div>

      {/* Menu Items */}
      <div className="mt-6 px-3 space-y-2">
        {/* HOME SECTION */}
        {activeTab === "home" && (
          <>
            <Link
              to="/chat/suggestions"
              className={linkClass("/dashboard/suggestions")}
            >
              👥 Friend Suggestions
            </Link>

            <Link
              to="/chat/requests"
              className={linkClass("/dashboard/requests")}
            >
              📩 Friend Requests
            </Link>

            <Link
              to="/chat/create-group"
              className={linkClass("/dashboard/create-group")}
            >
              ➕ Create Group
            </Link>
          </>
        )}

        {/* CHATS SECTION */}
        {activeTab === "chats" && (
          <>
            <Link
              to="/chat/private-chats"
              className={linkClass("/dashboard/private-chats")}
            >
              💬 Private Chats
            </Link>

            <Link
              to="/chat/group-chats"
              className={linkClass("/dashboard/group-chats")}
            >
              👨‍👩‍👧 Group Chats
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
