import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import { toast } from "sonner";
import API from "../../utils/API";

const ChatRoom = () => {
  const { chatId } = useParams();
  const { user } = useSelector((state) => state.auth);
  const [messages, setMessages] = useState([]);
  const [chat, setChat] = useState("");
  const scrollRef = useRef();
  const [newMessage, setNewMessage] = useState("");

  // Scroll to bottom on messages update
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    fetchMessages();
  }, [chatId]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    const newMsg = {
      id: messages.length + 1,
      sender: "u_current",
      text: newMessage,
      createdAt: new Date(),
    };
    setMessages((prev) => [...prev, newMsg]);
    setNewMessage("");
  };

  const fetchMessages = async () => {
    try {
      console.log(chatId);
      const res = await API.get(`/chat/${chatId}`);

      setChat(res.data?.data?.chat);
      console.log(res.data?.data?.chat);
      setMessages(res.data?.data?.messages);
    } catch (error) {
      toast.error(error.response.data?.message || error.message);
    }
  };

  return (
    <div className="w-auto flex flex-col h-full px-4 py-1 bg-gray-50">
      {/* Header */}
      <div className="p-4 bg-white shadow flex items-center rounded-b-2xl">
        <div className="w-10 h-10 rounded-full bg-indigo-400 flex items-center justify-center text-white font-bold mr-4">
          {chat?.otherUser?.username
            .split(" ")
            .map((w) => w[0])
            .join("")
            .toUpperCase()}
        </div>
        <div>
          <p className="capitalize">{chat?.otherUser?.username}</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
        {messages.map((msg) => (
          <div
            key={msg._id}
            ref={scrollRef}
            className={`max-w-[70%] p-2 rounded-xl break-word ${
              msg.sender === "u_current"
                ? "bg-blue-500 text-white self-end"
                : "bg-gray-200 text-gray-800 self-start"
            }`}
          >
            {msg.sender._id !== user._id && (
              <p className="text-xs font-semibold">
                {msg.sender === "u1" ? "Alice" : "Bob"}
              </p>
            )}
            <p>{msg.text}</p>
            <span className="text-xs text-gray-400 mt-0.5 block text-right">
              {dayjs(msg.createdAt).format("hh:mm A")}
            </span>
          </div>
        ))}

        {messages && messages.length > 0 ? (
          <>
            {messages.map((msg) => (
              <div
                key={msg._id}
                ref={scrollRef}
                className={`max-w-[70%] p-2 rounded-xl break-word ${
                  msg.sender === "u_current"
                    ? "bg-blue-500 text-white self-end"
                    : "bg-gray-200 text-gray-800 self-start"
                }`}
              >
                {msg.sender._id !== user._id && (
                  <p className="text-xs font-semibold">
                    {msg.sender === "u1" ? "Alice" : "Bob"}
                  </p>
                )}
                <p>{msg.text}</p>
                <span className="text-xs text-gray-400 mt-0.5 block text-right">
                  {dayjs(msg.createdAt).format("hh:mm A")}
                </span>
              </div>
            ))}
          </>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2 bg-blue-50">
              <p>No messages yet.</p>
            </div>
          </>
        )}
      </div>

      {/* Message Input */}
      <div className="p-4 bg-white flex gap-2 items-center rounded-t-2xl shadow-inner">
        <input
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={handleSendMessage}
          className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatRoom;

// Dummy data simulating API fetch based on chat schema
// useEffect(() => {
//   const dummyChat = {
//     name: chatId === "chat1" ? "Project Team" : "Alice Johnson",
//     messages: [
//       {
//         id: 1,
//         sender: "u1",
//         text: "Hello team!",
//         createdAt: new Date(Date.now() - 7200000),
//       },
//       {
//         id: 2,
//         sender: "u_current",
//         text: "Hi Alice, good morning!",
//         createdAt: new Date(Date.now() - 7100000),
//       },
//       {
//         id: 3,
//         sender: "u2",
//         text: "Morning everyone",
//         createdAt: new Date(Date.now() - 7000000),
//       },
//       {
//         id: 4,
//         sender: "u_current",
//         text: "Ready for the meeting?",
//         createdAt: new Date(Date.now() - 6800000),
//       },
//     ],
//   };

//   setChatName(dummyChat.name);
//   setMessages(dummyChat.messages);
// }, [chatId]);
