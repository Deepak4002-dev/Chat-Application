import { useNavigate } from "react-router-dom";
import { MessageCircle, UserMinus } from "lucide-react";
import { useState } from "react";
import API from "../../utils/API";
import { toast } from "sonner";
import { useEffect } from "react";

const Friends = () => {
  const navigate = useNavigate();
  const [friends, setFriends] = useState();
  const [filter, setFilter] = useState("all");

  const fetchFriends = async () => {
    try {
      const res = await API.get("/friend");
      console.log(res.data);
      setFriends(res.data?.data);
    } catch (error) {
      toast.error(error.respone.data?.message || error.messsage);
    }
  };

  useEffect(() => {
    fetchFriends();
  }, []);

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

      {/* List */}
      {friends?.length === 0 ? (
        <p className="text-sm text-gray-400">No friends found.</p>
      ) : (
        <ul className="flex flex-col gap-1">
          {friends?.map((f) => (
            <li
              key={f._id}
              className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
            >
              {/* Avatar with online dot */}
              <div className="relative shrink-0">
                <div className="w-10 h-10 rounded-full bg-indigo-400 flex items-center justify-center text-white font-semibold">
                  {f.username}
                </div>
                <span
                  className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white ${
                    f.status === "online" ? "bg-emerald-400" : "bg-gray-300"
                  }`}
                />
              </div>

              {/* Name + status */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800">{f.name}</p>
                <p className="text-xs text-gray-400">
                  {f.status === "online" && "Online"}
                </p>
              </div>

              {/* Actions — visible on hover */}
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => navigate(`/chat/${f.id}`)}
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
