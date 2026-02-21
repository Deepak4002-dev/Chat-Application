import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import io from "socket.io-client";
import dayjs from "dayjs";
import { toast } from "sonner";

const SOCKET_URL = "http://localhost:5000"; // Replace with your backend

const ChatRoom = () => {
  const { chatId } = useParams();
  const { user } = useSelector((state) => state.auth);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [socket, setSocket] = useState(null);
  const scrollRef = useRef();

  // Scroll to bottom
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // // Connect Socket
  // useEffect(() => {
  //   const s = io(SOCKET_URL, {
  //     query: { userId: user._id },
  //   });
  //   setSocket(s);

  //   // Listen for incoming messages
  //   s.on("receive_message", (msg) => {
  //     if (msg.chatId === chatId) {
  //       setMessages((prev) => [...prev, msg]);
  //     }
  //   });

  //   return () => {
  //     s.disconnect();
  //   };
  // }, [chatId, user._id]);

  // Fetch previous messages
  // useEffect(() => {
  //   const fetchMessages = async () => {
  //     try {
  //       const res = await axios.get(`/api/messages/${chatId}`);
  //       setMessages(res.data);
  //     } catch (error) {
  //       toast.error("Failed to load messages");
  //     }
  //   };
  //   fetchMessages();
  // }, [chatId]);

  // ChatRoom.js (dummy messages)
  useEffect(() => {
    const dummyMessages = {
      chat1: [
        {
          sender: "u1",
          senderName: "john_doe",
          text: "Hey, how are you?",
          createdAt: new Date(Date.now() - 600000).toISOString(),
        },
        {
          sender: "u_current",
          senderName: "You",
          text: "I’m good! How about you?",
          createdAt: new Date(Date.now() - 540000).toISOString(),
        },
      ],
      chat2: [
        {
          sender: "u2",
          senderName: "sarah_smith",
          text: "Are we still meeting tomorrow?",
          createdAt: new Date(Date.now() - 3600000).toISOString(),
        },
        {
          sender: "u_current",
          senderName: "You",
          text: "Yes! See you then.",
          createdAt: new Date(Date.now() - 3540000).toISOString(),
        },
      ],
      chat3: [],
    };

    setMessages(dummyMessages[chatId] || []);
  }, [chatId]);

  // Send message
  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const msg = {
      chatId,
      sender: user._id,
      text: newMessage,
      createdAt: new Date().toISOString(),
    };

    try {
      await axios.post(`/api/messages`, msg);
      setMessages((prev) => [...prev, msg]);
      socket.emit("send_message", msg);
      setNewMessage("");
    } catch (error) {
      toast.error("Failed to send message");
    }
  };

  return (
    <div className="flex flex-col h-full p-4">
      <div className="flex-1 overflow-y-auto mb-4 space-y-3">
        {messages.map((msg, idx) => {
          const isMe = msg.sender === user._id;
          return (
            <div
              key={idx}
              ref={scrollRef}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`p-2 rounded-xl max-w-xs break-word ${
                  isMe ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"
                }`}
              >
                {!isMe && msg.senderName && (
                  <p className="text-xs font-semibold">{msg.senderName}</p>
                )}
                <p>{msg.text}</p>
                <span className="text-[10px] text-gray-500 block text-right">
                  {dayjs(msg.createdAt).format("hh:mm A")}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input */}
      <form
        onSubmit={handleSend}
        className="flex items-center gap-2 border-t border-gray-300 pt-2"
      >
        <input
          type="text"
          className="flex-1 border rounded-xl px-4 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatRoom;
