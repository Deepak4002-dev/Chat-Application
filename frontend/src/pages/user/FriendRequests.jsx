import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";

const FriendRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loadingId, setLoadingId] = useState(null);

  // useEffect(() => {
  //   const fetchRequests = async () => {
  //     try {
  //       const res = await axios.get("/api/friends/requests");
  //       setRequests(res.data);
  //     } catch (error) {
  //       toast.error("Failed to load friend requests");
  //     }
  //   };

  //   fetchRequests();
  // }, []);

  useEffect(() => {
    const dummyRequests = [
      {
        _id: "req1",
        sender: {
          username: "john_doe",
          email: "john@example.com",
        },
      },
      {
        _id: "req2",
        sender: {
          username: "sarah_smith",
          email: "sarah@example.com",
        },
      },
      {
        _id: "req3",
        sender: {
          username: "mike_jones",
          email: "mike@example.com",
        },
      },
    ];

    setRequests(dummyRequests);
  }, []);

  const handleAction = async (requestId, action) => {
    try {
      setLoadingId(requestId);

      await axios.put(`/api/friends/${action}/${requestId}`);

      toast.success(
        action === "accept"
          ? "Friend request accepted"
          : "Friend request rejected",
      );

      // Remove from list after action
      setRequests((prev) => prev.filter((req) => req._id !== requestId));
    } catch (error) {
      toast.error(error.response?.data?.message || "Action failed");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-6">Friend Requests</h2>

      {requests.length === 0 ? (
        <p className="text-gray-500">No pending requests</p>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => (
            <div
              key={req._id}
              className="bg-white p-4 rounded-xl shadow-sm border flex justify-between items-center"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div>
                  <h3 className="font-semibold">{req.sender.username}</h3>
                  <p className="text-xs text-gray-400">{req.sender.email}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  disabled={loadingId === req._id}
                  onClick={() => handleAction(req._id, "accept")}
                  className="px-4 py-1 text-sm bg-green-500 text-white rounded-md hover:bg-green-600 transition"
                >
                  Accept
                </button>

                <button
                  disabled={loadingId === req._id}
                  onClick={() => handleAction(req._id, "reject")}
                  className="px-4 py-1 text-sm bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FriendRequests;
