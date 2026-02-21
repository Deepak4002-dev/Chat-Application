import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const CreateGroup = () => {
  const { user } = useSelector((state) => state.auth);
  const [groupName, setGroupName] = useState("");
  const [friends, setFriends] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // useEffect(() => {
  //   const fetchFriends = async () => {
  //     try {
  //       const res = await axios.get("/api/friends/list");
  //       setFriends(res.data);
  //     } catch (error) {
  //       toast.error("Failed to load friends");
  //     }
  //   };
  //   fetchFriends();
  // }, []);

  useEffect(() => {
    const dummyFriends = [
      { _id: "u1", username: "john_doe" },
      { _id: "u2", username: "sarah_smith" },
      { _id: "u3", username: "mike_jones" },
      { _id: "u4", username: "emma_wilson" },
    ];

    setFriends(dummyFriends);

    // If you want, simulate loading delay:
    // setTimeout(() => setFriends(dummyFriends), 500);
  }, []);

  const handleSelect = (friendId) => {
    if (selectedMembers.includes(friendId)) {
      setSelectedMembers(selectedMembers.filter((id) => id !== friendId));
    } else {
      setSelectedMembers([...selectedMembers, friendId]);
    }
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim() || selectedMembers.length === 0) return;

    try {
      setLoading(true);
      const res = await axios.post("/api/groups/create", {
        name: groupName,
        members: [user._id, ...selectedMembers], // include self
      });

      toast.success("Group created successfully!");
      navigate(`/dashboard/chat/${res.data._id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create group");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-6">Create New Group</h2>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Group Name</label>
        <input
          type="text"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          placeholder="Enter group name"
          className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Select Members</label>
        <div className="max-h-64 overflow-y-auto border rounded-lg p-2">
          {friends.length === 0 && (
            <p className="text-gray-500 text-sm">No friends available</p>
          )}
          {friends.map((friend) => (
            <div
              key={friend._id}
              className="flex items-center justify-between p-2 hover:bg-gray-100 rounded cursor-pointer"
              onClick={() => handleSelect(friend._id)}
            >
              <span>{friend.username}</span>
              {selectedMembers.includes(friend._id) && (
                <span className="text-blue-500 font-semibold">✓</span>
              )}
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={handleCreateGroup}
        disabled={loading || !groupName.trim() || selectedMembers.length === 0}
        className={`px-4 py-2 rounded-lg text-white ${
          loading || !groupName.trim() || selectedMembers.length === 0
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-500 hover:bg-blue-600"
        }`}
      >
        {loading ? "Creating..." : "Create Group"}
      </button>
    </div>
  );
};

export default CreateGroup;
