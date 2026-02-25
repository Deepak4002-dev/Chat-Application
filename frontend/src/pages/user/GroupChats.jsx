import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import dayjs from "dayjs";

import API from "../../utils/API";
import CreateGroup from "./CreateGroup";

const GroupChats = () => {
  const { user } = useSelector((state) => state.auth);
  const [groupChats, setGroupChats] = useState([]);
  const navigate = useNavigate();
  const scrollRef = useRef();
  const [isOpen, setOpen] = useState(false);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const fetchGroupChats = async () => {
    try {
      const res = await API.get("/chat/group-chats");
      setGroupChats(res.data?.data);
      console.log(res.data?.data);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    fetchGroupChats();
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
        <button
          onClick={() => setOpen(!isOpen)}
          className="px-4 py-2 bg-blue-500 text-white font-medium rounded-lg shadow hover:bg-blue-600 transition"
        >
          Create Group
        </button>
      </div>

      {isOpen && <CreateGroup isOpen={isOpen} setOpen={setOpen} />}

      {groupChats.length === 0 ? (
        <p className="text-gray-500 text-center">You have no group chats yet</p>
      ) : (
        <div className="space-y-4">
          {groupChats.map((groupChat) => (
            <div
              key={groupChat._id}
              ref={scrollRef}
              onClick={() => navigate(`/chat/${groupChat._id}`)}
              className="cursor-pointer bg-gray-50 p-4 rounded-2xl shadow-sm hover:shadow-lg hover:scale-[1.02] transition-transform flex justify-between items-center"
            >
              <div className="flex items-center gap-4">
                {/* Group Avatar */}
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-lg bg-linear-to-br ${getAvatarGradient(
                    groupChat.name,
                  )}`}
                >
                  {groupChat.name
                    .split(" ")
                    .map((w) => w[0])
                    .join("")
                    .toUpperCase()}
                </div>

                <div className="min-w-0">
                  <h3 className="font-semibold text-gray-800 text-lg truncate">
                    {groupChat.name}
                  </h3>
                  <p className="text-sm text-gray-500 truncate max-w-[200px]">
                    {groupChat.lastMessage?.content}
                  </p>
                  <p className="text-xs text-gray-400 truncate max-w-[200px] capitalize">
                    {groupChat.members.map((m) => m.username).join(", ")}
                  </p>
                  <p className="text-[12px] text-gray-400 mt-1 capitalize">
                    <span className="font-[500]">Created By</span>:{" "}
                    {groupChat.admin.username}
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-end">
                {groupChat.lastMessage && (
                  <span className="text-xs text-gray-400">
                    {dayjs(groupChat.lastMessage.createdAt).format("hh:mm A")}
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
