import { useNavigate } from "react-router-dom";
import { MessageCircle, UserMinus } from "lucide-react";
import { useState, useEffect } from "react";
import API from "../../utils/API";
import { toast } from "sonner";
import { useSelector } from "react-redux";

const Friends = () => {
  const navigate = useNavigate();
  const [friends, setFriends] = useState([]);
  const [filteredFriends, setFilteredFriends] = useState([]);
  const [filter, setFilter] = useState("all");
  const { user } = useSelector((state) => state.auth);

  const fetchFriends = async () => {
    try {
      const res = await API.get("/friend");
      console.log(res.data);

      const transformed = res.data?.data?.map((f) => {
        const other = f.sender._id === user._id ? f.receiver : f.sender;
        return {
          _id: f._id,
          userId: other._id,
          username: other.username,
          profilePic: other.profilePic,
          isOnline: other.isOnline,
        };
      });

      setFriends(transformed || []);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // Handle the filter changes (all, online, offline)
  const filterFriends = (filter) => {
    if (filter === "all") {
      setFilteredFriends(friends);
    } else if (filter === "online") {
      setFilteredFriends(friends.filter((f) => f.isOnline));
    } else if (filter === "offline") {
      setFilteredFriends(friends.filter((f) => !f.isOnline));
    }
  };

  const handleChat = async (userId) => {
    try {
      // console.log(userId);
      const res = await API.post("/chat/create", {
        otherId: userId,
      });
      const chat = res.data?.data;
      // console.log(chatId);
      navigate(`/chat/${chat._id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    fetchFriends(); // Fetch friends on component mount
  }, []);

  useEffect(() => {
    filterFriends(filter); // Re-filter whenever `filter` or `friends` changes
  }, [filter, friends]);

  return (
    <div className="px-8 py-6 w-full mt-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-xl font-semibold text-gray-800">Friends</h1>

        {/* Filter tabs */}
        <div className="flex gap-1 bg-gray-100 rounded-lg p-2 mt-2">
          {["all", "online", "offline"].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1 rounded-md text-xs font-medium capitalize transition-colors ${
                filter === tab
                  ? "bg-white text-gray-800 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* List of Friends */}
      {filteredFriends.length === 0 ? (
        <p className="text-sm text-gray-400">No friends found.</p>
      ) : (
        <ul className="flex flex-col gap-1">
          {filteredFriends.map((f) => (
            <li
              key={f._id}
              className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
            >
              {/* Avatar with online/offline dot */}
              <div className="relative shrink-0">
                <div className="w-10 h-10 rounded-full bg-indigo-400 flex items-center justify-center text-white font-semibold">
                  {f.username?.[0]?.toUpperCase()}
                </div>
                <span
                  className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white ${
                    f.isOnline ? "bg-emerald-400" : "bg-gray-300"
                  }`}
                />
              </div>

              {/* Name + status */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800">
                  {f.username}
                </p>
                <p className="text-xs text-gray-400">
                  {f.isOnline ? "Online" : "Offline"}
                </p>
              </div>

              {/* Actions — visible on hover */}
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleChat(f.userId)}
                  title="Send message"
                  className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-500 hover:bg-indigo-100 flex items-center justify-center transition-colors"
                >
                  <MessageCircle size={15} />
                </button>
                <button
                  title="Unfriend"
                  className="w-8 h-8 rounded-lg bg-red-50 text-red-400 hover:bg-red-100 flex items-center justify-center transition-colors"
                >
                  <UserMinus size={15} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Friends;
