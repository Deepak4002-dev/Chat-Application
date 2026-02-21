import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";

const FriendSuggestions = () => {
  const { user } = useSelector((state) => state.auth);
  const [users, setUsers] = useState([]);
  const [loadingId, setLoadingId] = useState(null);

  // useEffect(() => {
  //   const fetchUsers = async () => {
  //     try {
  //       const res = await axios.get("/api/users/suggestions");
  //       setUsers(res.data);
  //     } catch (error) {
  //       toast.error("Failed to load users");
  //     }
  //   };

  //   fetchUsers();
  // }, []);

  useEffect(() => {
    // Dummy data
    const dummyUsers = [
      {
        _id: "1",
        username: "john_doe",
        email: "john@example.com",
        isFriend: false,
        requestSent: false,
      },
      {
        _id: "2",
        username: "sarah_smith",
        email: "sarah@example.com",
        isFriend: true,
        requestSent: false,
      },
      {
        _id: "3",
        username: "mike_jones",
        email: "mike@example.com",
        isFriend: false,
        requestSent: true,
      },
      {
        _id: "4",
        username: "emma_wilson",
        email: "emma@example.com",
        isFriend: false,
        requestSent: false,
      },
    ];

    setUsers(dummyUsers);
  }, []);

  const handleSendRequest = async (receiverId) => {
    try {
      setLoadingId(receiverId);

      await axios.post("/api/friends/send-request", {
        receiverId,
      });

      toast.success("Friend request sent!");

      // Update UI
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
      <h2 className="text-xl font-semibold mb-6">Friend Suggestions</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((u) => (
          <div
            key={u._id}
            className="bg-white p-4 rounded-xl shadow-sm border flex flex-col items-center"
          >
            <div className="w-16 h-16 bg-gray-200 rounded-full mb-3"></div>

            <h3 className="font-semibold">{u.username}</h3>
            <p className="text-xs text-gray-400 mb-3">{u.email}</p>

            {u.isFriend ? (
              <button className="px-4 py-1 text-sm bg-green-100 text-green-600 rounded-md">
                Friends
              </button>
            ) : u.requestSent ? (
              <button className="px-4 py-1 text-sm bg-gray-200 text-gray-600 rounded-md">
                Request Sent
              </button>
            ) : (
              <button
                onClick={() => handleSendRequest(u._id)}
                disabled={loadingId === u._id}
                className="px-4 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
              >
                {loadingId === u._id ? "Sending..." : "Send Request"}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FriendSuggestions;
