import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import dayjs from "dayjs";

const PrivateChats = () => {
  const { user } = useSelector((state) => state.auth);
  const [chats, setChats] = useState([]);
  const navigate = useNavigate();

  // useEffect(() => {
  //   const fetchChats = async () => {
  //     try {
  //       const res = await axios.get("/api/chats/private");
  //       setChats(res.data);
  //     } catch (error) {
  //       toast.error("Failed to load chats");
  //     }
  //   };

  //   fetchChats();
  // }, []);
  // PrivateChats.js (dummy data)
  useEffect(() => {
    const dummyChats = [
      {
        _id: "chat1",
        members: [
          { _id: "u1", username: "john_doe" },
          { _id: "u_current", username: "You" },
        ],
        lastMessage: {
          text: "Hey, how are you?",
          createdAt: new Date().toISOString(),
        },
        unreadCount: 2,
      },
      {
        _id: "chat2",
        members: [
          { _id: "u2", username: "sarah_smith" },
          { _id: "u_current", username: "You" },
        ],
        lastMessage: {
          text: "Are we still meeting tomorrow?",
          createdAt: new Date().toISOString(),
        },
        unreadCount: 0,
      },
      {
        _id: "chat3",
        members: [
          { _id: "u3", username: "mike_jones" },
          { _id: "u_current", username: "You" },
        ],
        lastMessage: null,
        unreadCount: 0,
      },
    ];

    setChats(dummyChats);
  }, []);

  const getOtherUser = (members) => {
    return members.find((member) => member._id !== user._id);
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-6">Private Chats</h2>

      {chats.length === 0 ? (
        <p className="text-gray-500">No conversations yet</p>
      ) : (
        <div className="space-y-3">
          {chats.map((chat) => {
            const otherUser = getOtherUser(chat.members);

            return (
              <div
                key={chat._id}
                onClick={() => navigate(`/chat/${chat._id}`)}
                className="cursor-pointer bg-white p-4 rounded-xl border shadow-sm hover:bg-gray-50 transition flex justify-between items-center"
              >
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <div className="w-12 h-12 bg-gray-200 rounded-full"></div>

                  <div>
                    <h3 className="font-semibold">{otherUser?.username}</h3>

                    <p className="text-sm text-gray-500 truncate max-w-[180px]">
                      {chat.lastMessage?.text || "Start chatting..."}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end">
                  {/* Time */}
                  {chat.lastMessage && (
                    <span className="text-xs text-gray-400">
                      {dayjs(chat.lastMessage.createdAt).format("hh:mm A")}
                    </span>
                  )}

                  {/* Unread Badge */}
                  {chat.unreadCount > 0 && (
                    <span className="mt-1 bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
                      {chat.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PrivateChats;
