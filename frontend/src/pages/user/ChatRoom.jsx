import { useState, useEffect, useRef, useCallback } from "react";
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
  const [loading, setLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const bottomRef = useRef();
  const [newMessage, setNewMessage] = useState("");

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Fix 7: useCallback so fetchMessages is stable and safe in deps
  const fetchMessages = useCallback(async () => {
    try {
      setLoading(true);
      const res = await API.get(`/chat/${chatId}`);
      setChat(res.data?.data?.chat ?? null);
      setMessages(res.data?.data?.messages ?? []);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  }, [chatId]);

  // Fix 2: chatId in deps — re-runs when navigating between chats
  useEffect(() => {
    fetchMessages();

    // Fix 1: filter by chatId — ignore events from other chats
    const handleNewMessage = (data) => {
      if (data.chat?.toString() === chatId?.toString()) {
        setMessages((prev) => [...prev, data]);
      }
    };

    socket.on("newPrivateMessage", handleNewMessage);
    socket.on("newGroupMessage", handleNewMessage);

    return () => {
      socket.off("newPrivateMessage", handleNewMessage);
      socket.off("newGroupMessage", handleNewMessage);
    };
  }, [chatId, fetchMessages]);

  // Fix 8: isSending guard prevents duplicate sends
  const handleSendMessage = async () => {
    if (isSending) return;
    if (!newMessage.trim()) return toast.error("Message cannot be empty");
    try {
      setIsSending(true);
      await API.post("/chat/create-message", { chatId, content: newMessage });
      setNewMessage("");
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setIsSending(false);
    }
  };

  // Helper — resolve sender._id safely whether populated or raw ObjectId string
  const getSenderId = (sender) => {
    if (!sender) return null;
    if (typeof sender === "string") return sender;
    return sender._id?.toString();
  };

  const getSenderName = (sender) => {
    if (!sender) return "";
    if (typeof sender === "object") return sender.username;
    return "";
  };

  // Fix 4: header display name
  const headerName = chat?.isGroup ? chat?.name : chat?.otherUser?.username;

  const headerInitials = headerName
    ?.split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <div className="w-auto flex flex-col h-full px-4 py-1 bg-gray-50">
      {/* Header */}
      <div className="p-4 bg-white shadow flex items-center rounded-b-2xl">
        <div className="w-10 h-10 rounded-full bg-indigo-400 flex items-center justify-center text-white font-bold mr-4">
          {headerInitials}
        </div>
        <div>
          {/* Fix 4: correct name for both private and group */}
          <p className="capitalize">{headerName}</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
        {loading ? (
          <p className="text-sm text-gray-400 text-center mt-4">Loading...</p>
        ) : messages.length > 0 ? (
          <>
            {messages.map((msg) => {
              const senderId = getSenderId(msg.sender);
              const isOwn = senderId === user._id?.toString();
              return (
                <div
                  key={msg._id}
                  className={`max-w-[70%] p-2 rounded-xl break-words ${
                    isOwn
                      ? "bg-blue-500 text-white self-end"
                      : "bg-gray-200 text-gray-800 self-start"
                  }`}
                >
                  {/* Only show sender name in group chats — in private you already know who you're talking to */}
                  {chat?.isGroup && !isOwn && (
                    <p className="text-xs font-semibold capitalize">
                      {getSenderName(msg.sender)}
                    </p>
                  )}
                  <p>{msg.content}</p>
                  <span className="text-xs text-gray-400 mt-0.5 block text-right">
                    {dayjs(msg.createdAt).format("hh:mm A")}
                  </span>
                </div>
              );
            })}
            {/* Fix 3: single bottom anchor ref instead of ref on every message */}
            <div ref={bottomRef} />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-sm text-gray-400">No messages yet.</p>
          </div>
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
          disabled={isSending}
          className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSending ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
};

export default ChatRoom;
