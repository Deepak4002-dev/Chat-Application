import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { toast } from "sonner";
import API from "../../utils/API";

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const scrollRef = useRef();
  const [chats, setChats] = useState([]);

  // Dummy data simulating API fetch based on Chat schema
  // useEffect(() => {
  //   const dummyChats = [
  //     {
  //       _id: "chat1",
  //       name: "Project Team",
  //       isGroup: true,
  //       members: [
  //         { _id: "u1", username: "Alice" },
  //         { _id: "u2", username: "Bob" },
  //         { _id: "u_current", username: "You" },
  //       ],
  //       lastMessage: {
  //         text: "Let's finalize the report today.",
  //         createdAt: new Date(Date.now() - 3600000).toISOString(),
  //       },
  //       admin: { _id: "u1", username: "Alice" },
  //       unreadCount: 3,
  //     },
  //     {
  //       _id: "chat2",
  //       name: "Weekend Plans",
  //       isGroup: true,
  //       members: [
  //         { _id: "u3", username: "Carol" },
  //         { _id: "u4", username: "David" },
  //         { _id: "u_current", username: "You" },
  //       ],
  //       lastMessage: {
  //         text: "Movie night at 8?",
  //         createdAt: new Date(Date.now() - 7200000).toISOString(),
  //       },
  //       admin: { _id: "u3", username: "Carol" },
  //       unreadCount: 0,
  //     },
  //     {
  //       _id: "chat3",
  //       name: "",
  //       isGroup: false,
  //       members: [
  //         { _id: "u5", username: "Emma" },
  //         { _id: "u_current", username: "You" },
  //       ],
  //       lastMessage: {
  //         text: "Hey, are you free tomorrow?",
  //         createdAt: new Date(Date.now() - 1800000).toISOString(),
  //       },
  //       admin: { _id: "u5", username: "Emma" },
  //       unreadCount: 1,
  //     },
  //   ];
  //   setChats(dummyChats);
  // }, []);

  const fetchChats = async () => {
    try {
      const res = await API.get("/chat/all-chats");
      setChats(res.data?.data);
      console.log(res.data?.data);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

  const getAvatarGradient = (name) => {
    const colors = [
      "from-red-400 to-pink-500",
      "from-blue-400 to-purple-500",
      "from-green-400 to-teal-500",
      "from-yellow-400 to-orange-500",
    ];
    const index = (name?.length || 3) % colors.length;
    return colors[index];
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back,{" "}
          <span className="text-blue-600">{user?.username || "Guest"}</span>!
        </h1>
      </div>

      {/* Chats Grid */}
      <div className="grid grid-cols-1 gap-4">
        {chats.length === 0 ? (
          <p className="text-gray-500 text-center col-span-full">
            You have no chats yet
          </p>
        ) : (
          chats.map((chat) => {
            const chatName =
              chat.isGroup && chat.name
                ? chat.name
                : chat.members
                    .filter((m) => m._id.toString() !== user._id.toString())
                    .map((m) => m.username)
                    .join(", ");

            return (
              <div
                key={chat._id}
                ref={scrollRef}
                onClick={() => navigate(`/chat/${chat._id}`)}
                className="cursor-pointer bg-white p-4 rounded-2xl shadow-sm hover:shadow-lg hover:scale-[1.02] transition-transform flex justify-between items-center"
              >
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <div
                    className={`w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-lg bg-linear-to-br ${getAvatarGradient(
                      chatName,
                    )}`}
                  >
                    {chatName
                      .split(" ")
                      .map((w) => w[0])
                      .join("")
                      .toUpperCase()}
                  </div>

                  {/* Chat Info */}
                  <div className="min-w-0">
                    <h3 className="font-semibold capitalize text-gray-800 text-lg truncate">
                      {chatName}
                    </h3>
                    <p className="text-sm text-gray-500 truncate max-w-[200px]">
                      {chat?.lastMessage?.content && (
                        <span className="text-xs text-gray-400">
                          {chat.lastMessage.content}
                        </span>
                      )}
                    </p>
                    {chat.isGroup && (
                      <p className="text-xs text-gray-400 mt-1">
                        Admin: {chat.admin.username}
                      </p>
                    )}
                  </div>
                </div>

                {/* Timestamp & Unread */}
                <div className="flex flex-col gap-y-2 items-end">
                  {chat.lastMessage && (
                    <span className="text-xs text-gray-400">
                      {dayjs(chat.lastMessage.createdAt).format("hh:mm A")}
                    </span>
                  )}
                  {/* {chat.unreadCount > 0 && (
                    <span className="mt-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                      {chat.unreadCount}
                    </span>
                  )} */}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Dashboard;
