import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import API from "../../utils/API";

const SuggestionFriends = () => {
  const { user } = useSelector((state) => state.auth);
  const [users, setUsers] = useState([]);
  const [loadingId, setLoadingId] = useState(null);

  const fetchAllFriends = async () => {
    try {
      const res = await API.get("/friend/all");
      console.log(res.data);
      setUsers(res.data?.data);
    } catch (error) {
      toast.error(error.response.message?.data || error.message);
    }
  };

  useEffect(() => {
    fetchAllFriends();
  }, []);

  const handleSendRequest = async (receiverId) => {
    try {
      setLoadingId(receiverId);
      await axios.post("/friend/request", { receiverId });
      toast.success("Friend request sent!");
      setUsers((prev) =>
        prev.map((u) =>
          u._id === receiverId ? { ...u, requestSent: true } : u,
        ),
      );
    } catch (error) {
      toast.error(error.response?.data?.message || "Error sending request");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Friend Suggestions
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((u) => (
          <div
            key={u._id}
            className="bg-gray-50 p-5 rounded-2xl shadow-lg hover:shadow-xl transition-shadow flex flex-col items-center text-center"
          >
            {/* Avatar with initials */}
            <div className="w-20 h-20 bg-linear-to-br from-blue-400 to-purple-500 text-white rounded-full flex items-center justify-center text-xl font-bold mb-4">
              {u.username
                .split("_")
                .map((n) => n[0].toUpperCase())
                .join("")}
            </div>

            <h3 className="font-semibold text-lg text-gray-800">
              {u.username}
            </h3>
            <p className="text-sm text-gray-500 mb-4">{u.email}</p>

            {u.isFriend ? (
              <span className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-full font-medium">
                Friends
              </span>
            ) : u.requestSent ? (
              <span className="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded-full font-medium">
                Request Sent
              </span>
            ) : (
              <button
                onClick={() => handleSendRequest(u._id)}
                disabled={loadingId === u._id}
                className="px-5 py-2 text-sm bg-blue-500 text-white rounded-full hover:bg-blue-600 transition flex items-center justify-center font-medium"
              >
                {loadingId === u._id ? (
                  <svg
                    className="animate-spin h-5 w-5 mr-2 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
                    ></path>
                  </svg>
                ) : null}
                {loadingId === u._id ? "Sending..." : "Add Friend"}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SuggestionFriends;
