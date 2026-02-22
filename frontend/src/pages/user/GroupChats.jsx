// import React, { useEffect, useState, useRef } from "react";
// import { useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { toast } from "sonner";
// import dayjs from "dayjs";

// const GroupChats = () => {
//   const { user } = useSelector((state) => state.auth);
//   const [groups, setGroups] = useState([]);
//   const navigate = useNavigate();
//   const scrollRef = useRef();

//   // Scroll to bottom automatically if needed (optional)
//   useEffect(() => {
//     scrollRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [groups]);

//   // Fetch all group chats for current user
//   // useEffect(() => {
//   //   const fetchGroups = async () => {
//   //     try {
//   //       const res = await axios.get("/api/chats/groups");
//   //       setGroups(res.data);
//   //     } catch (error) {
//   //       toast.error("Failed to load group chats");
//   //     }
//   //   };
//   //   fetchGroups();
//   // }, []);

//   useEffect(() => {
//     const dummyGroups = [
//       {
//         _id: "group1",
//         name: "Project Team",
//         members: [
//           { _id: "u1", username: "john_doe" },
//           { _id: "u2", username: "sarah_smith" },
//           { _id: "u_current", username: "You" },
//         ],
//         lastMessage: {
//           text: "Let’s finalize the report today.",
//           createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
//         },
//         unreadCount: 3,
//       },
//       {
//         _id: "group2",
//         name: "Weekend Plans",
//         members: [
//           { _id: "u3", username: "mike_jones" },
//           { _id: "u4", username: "emma_wilson" },
//           { _id: "u_current", username: "You" },
//         ],
//         lastMessage: {
//           text: "Movie night at 8?",
//           createdAt: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
//         },
//         unreadCount: 0,
//       },
//       {
//         _id: "group3",
//         name: "Study Group",
//         members: [
//           { _id: "u5", username: "alice_brown" },
//           { _id: "u6", username: "bob_clark" },
//           { _id: "u_current", username: "You" },
//         ],
//         lastMessage: null, // no messages yet
//         unreadCount: 0,
//       },
//     ];

//     setGroups(dummyGroups);
//   }, []);
//   return (
//     <div className="p-6">
//       <div className="flex justify-between mb-6">
//         <h2 className="text-xl font-semibold mb-6">Group Chats</h2>
//         <div>
//           <button className="px-3 py-1 bg-blue-500 text-white ">
//             Create Group
//           </button>
//         </div>
//       </div>

//       {groups.length === 0 ? (
//         <p className="text-gray-500">You have no group chats yet</p>
//       ) : (
//         <div className="space-y-3">
//           {groups.map((group) => (
//             <div
//               key={group._id}
//               ref={scrollRef}
//               onClick={() => navigate(`/chat/${group._id}`)}
//               className="cursor-pointer bg-white p-4 rounded-xl border shadow-sm hover:bg-gray-50 transition flex justify-between items-center"
//             >
//               <div className="flex items-center gap-4">
//                 {/* Group Avatar */}
//                 <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-white font-bold">
//                   {group.name
//                     .split(" ")
//                     .map((w) => w[0])
//                     .join("")
//                     .toUpperCase()}
//                 </div>

//                 <div>
//                   <h3 className="font-semibold">{group.name}</h3>
//                   <p className="text-sm text-gray-500 truncate max-w-[180px]">
//                     {group.lastMessage?.text || "Start chatting..."}
//                   </p>
//                   <p className="text-xs text-gray-400">
//                     {group.members
//                       .filter((m) => m._id !== user._id)
//                       .map((m) => m.username)
//                       .join(", ")}
//                   </p>
//                 </div>
//               </div>

//               <div className="flex flex-col items-end">
//                 {group.lastMessage && (
//                   <span className="text-xs text-gray-400">
//                     {dayjs(group.lastMessage.createdAt).format("hh:mm A")}
//                   </span>
//                 )}
//                 {group.unreadCount > 0 && (
//                   <span className="mt-1 bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
//                     {group.unreadCount}
//                   </span>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default GroupChats;
import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import dayjs from "dayjs";

const GroupChats = () => {
  const { user } = useSelector((state) => state.auth);
  const [groups, setGroups] = useState([]);
  const navigate = useNavigate();
  const scrollRef = useRef();

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [groups]);

  // Fetch groups (replace with your API call)
  useEffect(() => {
    const dummyGroups = [
      {
        _id: "group1",
        name: "Project Team",
        isGroup: true,
        members: [
          { _id: "u1", username: "john_doe" },
          { _id: "u2", username: "sarah_smith" },
          { _id: "u_current", username: "You" },
        ],
        lastMessage: {
          text: "Let's finalize the report today.",
          createdAt: new Date(Date.now() - 3600000).toISOString(),
        },
        admin: { _id: "u1", username: "john_doe" },
        unreadCount: 3,
      },
      {
        _id: "group2",
        name: "Weekend Plans",
        isGroup: true,
        members: [
          { _id: "u3", username: "mike_jones" },
          { _id: "u4", username: "emma_wilson" },
          { _id: "u_current", username: "You" },
        ],
        lastMessage: {
          text: "Movie night at 8?",
          createdAt: new Date(Date.now() - 7200000).toISOString(),
        },
        admin: { _id: "u3", username: "mike_jones" },
        unreadCount: 0,
      },
    ];

    setGroups(dummyGroups);
  }, []);

  const getAvatarGradient = (name) => {
    const colors = [
      "from-red-400 to-pink-500",
      "from-blue-400 to-purple-500",
      "from-green-400 to-teal-500",
      "from-yellow-400 to-orange-500",
    ];
    const index = name.length % colors.length;
    return colors[index];
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Group Chats</h2>
        <button className="px-4 py-2 bg-blue-500 text-white font-medium rounded-lg shadow hover:bg-blue-600 transition">
          Create Group
        </button>
      </div>

      {groups.length === 0 ? (
        <p className="text-gray-500 text-center">You have no group chats yet</p>
      ) : (
        <div className="space-y-4">
          {groups.map((group) => (
            <div
              key={group._id}
              ref={scrollRef}
              onClick={() => navigate(`/chat/${group._id}`)}
              className="cursor-pointer bg-gray-50 p-4 rounded-2xl shadow-sm hover:shadow-lg hover:scale-[1.02] transition-transform flex justify-between items-center"
            >
              <div className="flex items-center gap-4">
                {/* Group Avatar */}
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-lg bg-gradient-to-br ${getAvatarGradient(
                    group.name,
                  )}`}
                >
                  {group.name
                    .split(" ")
                    .map((w) => w[0])
                    .join("")
                    .toUpperCase()}
                </div>

                <div className="min-w-0">
                  <h3 className="font-semibold text-gray-800 text-lg truncate">
                    {group.name}
                  </h3>
                  <p className="text-sm text-gray-500 truncate max-w-[200px]">
                    {group.lastMessage?.text || "Start chatting..."}
                  </p>
                  <p className="text-xs text-gray-400 truncate max-w-[200px]">
                    {group.members
                      .filter((m) => m._id !== user._id)
                      .map((m) => m.username)
                      .join(", ")}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Admin: {group.admin.username}
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-end">
                {group.lastMessage && (
                  <span className="text-xs text-gray-400">
                    {dayjs(group.lastMessage.createdAt).format("hh:mm A")}
                  </span>
                )}
                {group.unreadCount > 0 && (
                  <span className="mt-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                    {group.unreadCount}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GroupChats;
