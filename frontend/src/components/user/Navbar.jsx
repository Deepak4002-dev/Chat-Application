// import React, { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useSelector, useDispatch } from "react-redux";
// import { User, LogOut, UserCircle, Bell, Check, X } from "lucide-react";
// import { logout } from "../../rtk/auth/authAsyncThunk";
// import { toast } from "sonner";
// import { disconnectSocket } from "../../rtk/socket/socketThunk";
// import { socket } from "../../utils/Socket";

// const Navbar = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [isNotificationOpen, setNotificationOpen] = useState(false);
//   const { isLoggedIn, user } = useSelector((state) => state.auth);
//   const [friendRequest, setFriendRequest] = useState([]);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   // const requests = [
//   //   {
//   //     username: "shyam",
//   //     pic: "S",
//   //   },
//   //   {
//   //     username: "hari",
//   //     pic: "H",
//   //   },
//   // ];

//   useEffect(() => {
//     socket.on("friendRequest", (data) => {
//       setFriendRequest((prev) => [...prev, data]);
//     });
//   }, []);

//   const handleLogout = async () => {
//     try {
//       const res = await dispatch(logout()).unwrap();
//       dispatch(disconnectSocket());
//       toast.success(res.message);
//       setIsOpen(false);
//       navigate("/");
//     } catch (error) {
//       toast.error(error.message);
//     }
//   };

//   const handleReject = (requestId) => {};

//   const handleAccept = (requestId) => {};

//   return (
//     <nav className="w-full h-16 bg-white border-b border-gray-100 flex justify-between items-center px-6 md:px-10 sticky top-0 z-50">
//       <div className="flex w-full items-center justify-end gap-x-5">
//         <div className="relative mt-2">
//           <button
//             className="cursor-pointer "
//             onClick={() => setNotificationOpen(!isNotificationOpen)}
//           >
//             <Bell size={25} className="hover:text-blue-500 cursor-pointer" />
//           </button>
//           <p className="absolute -top-1.5 -right-1 h-4 w-4 text-[11px] flex justify-center items-center rounded-full cursor-pointer bg-blue-300 pointer-events-none">
//             <span>1</span>
//           </p>
//         </div>
//         <div className="relative">
//           {/* User Icon Button */}
//           <button
//             onClick={() => setIsOpen(!isOpen)}
//             className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors focus:outline-none cursor-pointer"
//           >
//             <User size={23} className="text-gray-700 cursor-pointer" />
//           </button>

//           {/* Dropdown Menu */}
//           {isOpen && (
//             <>
//               {/* Invisible backdrop to close dropdown when clicking outside */}
//               <div
//                 className="fixed inset-0 z-10"
//                 onClick={() => setIsOpen(false)}
//               ></div>

//               <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-lg py-2 z-20 overflow-hidden">
//                 <div className="px-4 py-2 border-b border-gray-50">
//                   <p className="text-xs text-gray-400">Signed in as</p>
//                   <p className="text-sm font-semibold truncate">
//                     {user?.name || "User"}
//                   </p>
//                 </div>

//                 <Link
//                   to="profile"
//                   className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
//                   onClick={() => setIsOpen(false)}
//                 >
//                   <UserCircle size={16} />
//                   Profile
//                 </Link>

//                 <button
//                   onClick={handleLogout}
//                   className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
//                 >
//                   <LogOut size={16} />
//                   Logout
//                 </button>
//               </div>
//             </>
//           )}

//           {isNotificationOpen && (
//             <>
//               <div
//                 className="fixed inset-0 z-10"
//                 onClick={() => setNotificationOpen(false)}
//               ></div>

//               <div className="absolute right-0 mt-3 w-96 bg-white border border-gray-100 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-200">
//                 <div className="max-h-[450px] overflow-y-auto">
//                   {friendRequest?.map((request, key) => (
//                     <div
//                       key={key}
//                       className="flex items-center gap-x-4 p-4 hover:bg-gray-50/80 transition-colors duration-200 border-b border-gray-50 last:border-0"
//                     >
//                       {/* Avatar Placeholder */}
//                       <div className="shrink-0">
//                         <div className="w-11 h-11 bg-linear-to-br from-gray-100 to-gray-200 rounded-full border border-gray-100 shadow-sm" />
//                       </div>

//                       {/* Content */}
//                       <div className="flex-1 min-w-0">
//                         <h1 className="text-sm font-semibold text-gray-900 truncate">
//                           {request.sender.username}
//                         </h1>
//                         <p className="text-[12px] text-gray-500 leading-tight">
//                           Sent you a friend request
//                         </p>
//                       </div>

//                       {/* Actions */}
//                       <div className="flex items-center gap-x-2 ml-2">
//                         <button
//                           onClick={() => handleAccept(request.requestId)}
//                           className="p-2 bg-green-50 text-green-600 rounded-full hover:bg-green-500 hover:text-white transition-all duration-200 active:scale-90"
//                         >
//                           <Check size={16} strokeWidth={3} />
//                         </button>

//                         <button
//                           onClick={() => handleReject(request.requestId)}
//                           className="p-2 bg-red-50 text-red-600 rounded-full hover:bg-red-500 hover:text-white transition-all duration-200 active:scale-90"
//                         >
//                           <X size={16} strokeWidth={3} />
//                         </button>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </>
//           )}
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { User, LogOut, UserCircle, Bell, Check, X } from "lucide-react";
import { logout } from "../../rtk/auth/authAsyncThunk";
import { toast } from "sonner";
import { disconnectSocket } from "../../rtk/socket/socketThunk";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isNotificationOpen, setNotificationOpen] = useState(false);
  const { isLoggedIn, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { friendRequests } = useSelector((state) => state.socket);
  const { notificationCount } = useSelector((state) => state.socket);

  const handleLogout = async () => {
    try {
      const res = await dispatch(logout()).unwrap();
      dispatch(disconnectSocket());
      toast.success(res.message);
      setIsOpen(false);
      navigate("/");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleReject = (requestId) => {};

  const handleAccept = (requestId) => {};

  return (
    <nav className="w-full h-16 bg-white border-b border-gray-100 flex justify-between items-center px-6 md:px-10 sticky top-0 z-50">
      <div className="flex w-full items-center justify-end gap-x-5">
        <div className="relative mt-2">
          <button
            className="cursor-pointer"
            onClick={() => setNotificationOpen(!isNotificationOpen)}
          >
            <Bell size={25} className="hover:text-blue-500 cursor-pointer" />
          </button>

          {/* Notification Badge */}
          {notificationCount > 0 && (
            <p className="absolute -top-1.5 -right-1 h-4 w-4 text-[11px] flex justify-center items-center rounded-full cursor-pointer bg-blue-300 pointer-events-none">
              <span>{notificationCount}</span>
            </p>
          )}
        </div>

        <div className="relative">
          {/* User Icon Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors focus:outline-none cursor-pointer"
          >
            <User size={23} className="text-gray-700 cursor-pointer" />
          </button>

          {/* Dropdown Menu */}
          {isOpen && (
            <>
              {/* Invisible backdrop to close dropdown when clicking outside */}
              <div
                className="fixed inset-0 z-10"
                onClick={() => setIsOpen(false)}
              ></div>

              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-lg py-2 z-20 overflow-hidden">
                <div className="px-4 py-2 border-b border-gray-50">
                  <p className="text-xs text-gray-400">Signed in as</p>
                  <p className="text-sm font-semibold truncate">
                    {user?.username || "User"}
                  </p>
                </div>

                <Link
                  to="profile"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <UserCircle size={16} />
                  Profile
                </Link>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            </>
          )}

          {isNotificationOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setNotificationOpen(false)}
              ></div>

              <div className="absolute right-0 mt-3 w-96 bg-white border border-gray-100 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-200">
                <div className="max-h-[450px] overflow-y-auto">
                  {friendRequests?.map((request, key) => (
                    <div
                      key={key}
                      className="flex items-center gap-x-4 p-4 hover:bg-gray-50/80 transition-colors duration-200 border-b border-gray-50 last:border-0"
                    >
                      {/* Avatar Placeholder */}
                      <div className="shrink-0">
                        <div className="w-11 h-11 bg-linear-to-br from-gray-100 to-gray-200 rounded-full border border-gray-100 shadow-sm" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <h1 className="text-sm font-semibold text-gray-900 truncate">
                          {request.sender.username}
                        </h1>
                        <p className="text-[12px] text-gray-500 leading-tight">
                          Sent you a friend request
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-x-2 ml-2">
                        <button
                          onClick={() => handleAccept(request.requestId)}
                          className="p-2 bg-green-50 text-green-600 rounded-full hover:bg-green-500 hover:text-white transition-all duration-200 active:scale-90"
                        >
                          <Check size={16} strokeWidth={3} />
                        </button>

                        <button
                          onClick={() => handleReject(request.requestId)}
                          className="p-2 bg-red-50 text-red-600 rounded-full hover:bg-red-500 hover:text-white transition-all duration-200 active:scale-90"
                        >
                          <X size={16} strokeWidth={3} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
