// import React, { useEffect, useState, useRef } from "react";
// import { useParams } from "react-router-dom";
// import { useSelector } from "react-redux";
// import axios from "axios";
// import io from "socket.io-client";
// import dayjs from "dayjs";
// import { toast } from "sonner";

// const SOCKET_URL = "http://localhost:5000"; // Replace with your backend

// const ChatRoom = () => {
//   const { chatId } = useParams();
//   const { user } = useSelector((state) => state.auth);
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState("");
//   const [socket, setSocket] = useState(null);
//   const scrollRef = useRef();

//   // Scroll to bottom
//   useEffect(() => {
//     scrollRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   // // Connect Socket
//   // useEffect(() => {
//   //   const s = io(SOCKET_URL, {
//   //     query: { userId: user._id },
//   //   });
//   //   setSocket(s);

//   //   // Listen for incoming messages
//   //   s.on("receive_message", (msg) => {
//   //     if (msg.chatId === chatId) {
//   //       setMessages((prev) => [...prev, msg]);
//   //     }
//   //   });

//   //   return () => {
//   //     s.disconnect();
//   //   };
//   // }, [chatId, user._id]);

//   // Fetch previous messages
//   // useEffect(() => {
//   //   const fetchMessages = async () => {
//   //     try {
//   //       const res = await axios.get(`/api/messages/${chatId}`);
//   //       setMessages(res.data);
//   //     } catch (error) {
//   //       toast.error("Failed to load messages");
//   //     }
//   //   };
//   //   fetchMessages();
//   // }, [chatId]);

//   // ChatRoom.js (dummy messages)
//   useEffect(() => {
//     const dummyMessages = {
//       group1: [
//         {
//           sender: "u1",
//           senderName: "john_doe",
//           text: "Hey team!",
//           createdAt: new Date(Date.now() - 600000).toISOString(),
//         },
//         {
//           sender: "u_current",
//           senderName: "You",
//           text: "Working on the report.",
//           createdAt: new Date(Date.now() - 540000).toISOString(),
//         },
//       ],
//       group2: [
//         {
//           sender: "u3",
//           senderName: "mike_jones",
//           text: "Movie at 8?",
//           createdAt: new Date(Date.now() - 3600000).toISOString(),
//         },
//       ],
//       group3: [],
//     };

//     setMessages(dummyMessages[chatId] || []);
//   }, [chatId]);

//   // Send message
//   const handleSend = async (e) => {
//     e.preventDefault();
//     if (!newMessage.trim()) return;

//     const msg = {
//       chatId,
//       sender: user._id,
//       text: newMessage,
//       createdAt: new Date().toISOString(),
//     };

//     try {
//       await axios.post(`/api/messages`, msg);
//       setMessages((prev) => [...prev, msg]);
//       socket.emit("send_message", msg);
//       setNewMessage("");
//     } catch (error) {
//       toast.error("Failed to send message");
//     }
//   };

//   return (
//     <div className="flex flex-col h-auto">
//       <div className="flex-1 overflow-y-auto mb-4 space-y-3">
//         {messages.map((msg, idx) => {
//           const isMe = msg.sender === user._id;
//           return (
//             <div
//               key={idx}
//               ref={scrollRef}
//               className={`flex ${isMe ? "justify-end" : "justify-start"}`}
//             >
//               <div
//                 className={`p-2 rounded-xl max-w-xs break-word ${
//                   isMe ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"
//                 }`}
//               >
//                 {!isMe && msg.senderName && (
//                   <p className="text-xs font-semibold">{msg.senderName}</p>
//                 )}
//                 <p>{msg.text}</p>
//                 <span className="text-[10px] text-gray-500 block text-right">
//                   {dayjs(msg.createdAt).format("hh:mm A")}
//                 </span>
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       {/* Input */}
//       <form onSubmit={handleSend} className="flex items-center gap-2">
//         <input
//           type="text"
//           className="flex-1 border rounded-xl px-4 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
//           placeholder="Type a message..."
//           value={newMessage}
//           onChange={(e) => setNewMessage(e.target.value)}
//         />
//         <button
//           type="submit"
//           className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition"
//         >
//           Send
//         </button>
//       </form>
//     </div>
//   );
// };

// export default ChatRoom;

import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import dayjs from "dayjs";

const ChatRoom = () => {
  const { chatId } = useParams();
  const { user } = useSelector((state) => state.auth);
  const [messages, setMessages] = useState([]);
  const [chatName, setChatName] = useState("");
  const scrollRef = useRef();
  const [newMessage, setNewMessage] = useState("");

  // Scroll to bottom on messages update
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Dummy data simulating API fetch based on chat schema
  useEffect(() => {
    // Example: group or one-on-one chat
    const dummyChat = {
      name: chatId === "chat1" ? "Project Team" : "Alice Johnson",
      messages: [
        {
          id: 1,
          sender: "u1",
          text: "Hello team!",
          createdAt: new Date(Date.now() - 7200000),
        },
        {
          id: 2,
          sender: "u_current",
          text: "Hi Alice, good morning!",
          createdAt: new Date(Date.now() - 7100000),
        },
        {
          id: 3,
          sender: "u2",
          text: "Morning everyone",
          createdAt: new Date(Date.now() - 7000000),
        },
        {
          id: 4,
          sender: "u_current",
          text: "Ready for the meeting?",
          createdAt: new Date(Date.now() - 6800000),
        },
      ],
    };

    setChatName(dummyChat.name);
    setMessages(dummyChat.messages);
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

  return (
    <div className="w-auto flex flex-col h-full px-4 py-1 bg-gray-50">
      {/* Header */}
      <div className="p-4 bg-white shadow flex items-center rounded-b-2xl">
        <div className="w-10 h-10 rounded-full bg-indigo-400 flex items-center justify-center text-white font-bold mr-4">
          {chatName
            .split(" ")
            .map((w) => w[0])
            .join("")
            .toUpperCase()}
        </div>
        <div>
          <h2 className="font-bold text-lg">{chatName}</h2>
          <p className="text-xs text-gray-400">
            {messages.length > 0
              ? `Last message: ${dayjs(messages[messages.length - 1].createdAt).format("hh:mm A")}`
              : "No messages yet"}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
        {messages.map((msg) => (
          <div
            key={msg.id}
            ref={scrollRef}
            className={`max-w-[70%] p-2 rounded-xl break-words ${
              msg.sender === "u_current"
                ? "bg-blue-500 text-white self-end"
                : "bg-gray-200 text-gray-800 self-start"
            }`}
          >
            {msg.sender !== "u_current" && (
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
