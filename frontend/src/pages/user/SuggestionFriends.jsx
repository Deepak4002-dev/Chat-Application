import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import API from "../../utils/API";

const SuggestionFriends = () => {
  const { user } = useSelector((state) => state.auth);
  const [users, setUsers] = useState([]);
  const [loadingId, setLoadingId] = useState(null);
  const { friendRequests } = useSelector((state) => state.socket);

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
      const res = await API.post("/friend/request", {
        receiver_id: receiverId,
      });
      toast.success(res.data?.message);
      fetchAllFriends();
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoadingId(null);
    }
  };

  const handleAccept = async (requestId) => {
    try {
      setLoadingId(requestId);
      const res = await API.post(`/friend/accept/${requestId}`);
      toast.success(res.data?.message);
      fetchAllFriends();
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoadingId(null);
    }
  };

  const handleCancel = async (requestId) => {
    try {
      setLoadingId(requestId);
      const res = await API.delete(`/friend/cancel/${requestId}`);
      toast.success(res.data?.message);
      fetchAllFriends();
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoadingId(null);
    }
  };

  const handleReject = async (requestId) => {
    try {
      setLoadingId(requestId);
      const res = await API.delete(`/friend/reject/${requestId}`);
      toast.success(res.data?.message);
      fetchAllFriends();
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
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

            <h3 className="font-semibold text-lg text-gray-800 mb-2">
              {u.username}
            </h3>

            {u.friendStatus === "friend" ? (
              <span className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-full">
                Friends
              </span>
            ) : u.friendStatus === "request_sent" ? (
              <button
                onClick={() => handleCancel(u.requestId)}
                className="px-3 py-1 text-sm bg-gray-200 text-gray-600 rounded-full"
              >
                Cancel Request
              </button>
            ) : u.friendStatus === "request_received" ? (
              <div className="flex gap-2">
                <button
                  onClick={() => handleAccept(u.requestId)}
                  className="px-3 py-1 text-sm bg-green-500 text-white rounded-full"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleReject(u.requestId)}
                  className="px-3 py-1 text-sm bg-red-400 text-white rounded-full"
                >
                  Reject
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleSendRequest(u._id)}
                className="px-3 py-1 text-sm bg-blue-500 text-white rounded-full"
              >
                Add Friend
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SuggestionFriends;
