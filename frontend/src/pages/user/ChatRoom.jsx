import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import { toast } from "sonner";
import API from "../../utils/API";
import { socket } from "../../utils/Socket";

const ChatRoom = () => {
  const { chatId } = useParams();
  const { user } = useSelector((state) => state.auth);
  const [messages, setMessages] = useState([]);
  const [chat, setChat] = useState(null);
  const scrollRef = useRef();
  const [newMessage, setNewMessage] = useState("");

  // Scroll to bottom on messages update
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    fetchMessages();

    socket.on("newPrivateMessage", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off("newPrivateMessage");
    };
  }, []);

  const handleSendMessage = async () => {
    try {
      if (!newMessage.trim()) return toast.error("empty content");
      const newMsg = {
        chatId: chatId,
        content: newMessage,
      };

      const res = await API.post("/chat/create-message", newMsg);
      // Add sender's own message to state immediately (backend only emits to receiver)
      // setMessages((prev) => [
      //   ...prev,
      //   {
      //     ...res.data.data,
      //     sender: { _id: user._id, username: user.username },
      //   },
      // ]);
      setNewMessage("");
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const fetchMessages = async () => {
    try {
      const res = await API.get(`/chat/${chatId}`);
      console.log(res.data?.data);
      setChat(res.data?.data?.chat ?? null);
      setMessages(res.data?.data?.messages ?? []);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="w-auto flex flex-col h-full px-4 py-1 bg-gray-50">
      {/* Header */}
      <div className="p-4 bg-white shadow flex items-center rounded-b-2xl">
        <div className="w-10 h-10 rounded-full bg-indigo-400 flex items-center justify-center text-white font-bold mr-4">
          {chat?.otherUser?.username
            ?.split(" ")
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
        {messages && messages.length > 0 ? (
          <>
            {messages.map((msg) => (
              <div
                key={msg._id}
                ref={scrollRef}
                className={`max-w-[70%] p-2 rounded-xl break-word ${
                  msg.sender._id?.toString() === user._id?.toString()
                    ? "bg-blue-500 text-white self-end"
                    : "bg-gray-200 text-gray-800 self-start"
                }`}
              >
                {msg.sender._id?.toString() !== user._id?.toString() && (
                  <p className="text-xs font-semibold capitalize">
                    {msg?.sender?.username}
                  </p>
                )}
                <p>{msg.content}</p>
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
