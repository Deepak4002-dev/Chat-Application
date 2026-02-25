// import { useEffect } from "react";
// import API from "../../utils/API";
// import { useState } from "react";
// import { useSelector } from "react-redux";
// import { toast } from "sonner";

// const CreateGroup = ({ isOpen, setOpen }) => {
//   const [groupName, setGroupName] = useState("");
//   const [friends, setFriends] = useState([]);
//   const [selectedMembers, setSelectedMembers] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const { user } = useSelector((state) => state.auth);

//   const fetchFriends = async () => {
//     try {
//       const res = await API.get("/friend");
//       const myFriends = res.data?.data;
//       const transformed = myFriends.map((f) => {
//         const other = f.sender._id !== user._id ? f.sender : f.receiver;
//         return {
//           _id: f._id,
//           userId: other._id,
//           username: other.username,
//           profilePic: other.profilePic,
//         };
//       });
//       setFriends(transformed);
//     } catch (error) {}
//   };

//   const handleCreateGroup = async () => {
//     try {
//       setLoading(true);
//       const res = await API.post("/chat/create-group", {
//         name: groupName,
//         members: selectedMembers,
//       });

//       console.log(res.data?.data);
//       toast.success(res.data?.message);
//       setOpen(!isOpen);
//       setSelectedMembers([]);
//       setGroupName("");
//     } catch (error) {
//       toast.error(error.response?.data?.message || error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSelect = (friendId) => {
//     if (selectedMembers.includes(friendId)) {
//       setSelectedMembers(selectedMembers.filter((id) => id !== friendId));
//     } else {
//       setSelectedMembers([...selectedMembers, friendId]);
//     }
//   };

//   useEffect(() => {
//     fetchFriends();
//   }, []);

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-md transition-all">
//       <div className="bg-white w-full max-w-md mx-4 rounded-3xl shadow-2xl overflow-hidden border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
//         <div className="p-8">
//           <div className="flex justify-between items-center mb-8">
//             <h2 className="text-2xl font-bold text-gray-800 tracking-tight">
//               Create New Group
//             </h2>
//             <button
//               onClick={() => setOpen(false)}
//               className="text-gray-400 hover:text-gray-600 transition-colors"
//             >
//               <svg
//                 className="w-6 h-6"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M6 18L18 6M6 6l12 12"
//                 />
//               </svg>
//             </button>
//           </div>

//           <div className="space-y-6">
//             {/* Group Name Input */}
//             <div>
//               <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 ml-1">
//                 Group Name
//               </label>
//               <input
//                 type="text"
//                 value={groupName}
//                 onChange={(e) => setGroupName(e.target.value)}
//                 placeholder="Enter group name"
//                 className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400"
//               />
//             </div>

//             {/* Members Selection */}
//             <div>
//               <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 ml-1">
//                 Select Members
//               </label>
//               <div className="max-h-60 overflow-y-auto border border-gray-100 rounded-2xl bg-gray-50/50 p-2 space-y-1 custom-scrollbar">
//                 {friends.length === 0 && (
//                   <p className="text-gray-400 text-sm py-8 text-center">
//                     No friends available
//                   </p>
//                 )}
//                 {friends.map((friend) => {
//                   const isSelected = selectedMembers.includes(friend.userId);
//                   return (
//                     <div
//                       key={friend.userId}
//                       className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all duration-200 ${
//                         isSelected
//                           ? "bg-blue-500 text-white shadow-md shadow-blue-200"
//                           : "hover:bg-white hover:shadow-sm text-gray-700"
//                       }`}
//                       onClick={() => handleSelect(friend.userId)}
//                     >
//                       <div className="flex items-center gap-3">
//                         <div
//                           className={`w-8 h-8 rounded-full border ${isSelected ? "border-blue-400 bg-blue-400" : "border-gray-200 bg-gray-200"}`}
//                         />
//                         <span className="font-medium text-sm">
//                           {friend.username}
//                         </span>
//                       </div>
//                       {isSelected && (
//                         <svg
//                           className="w-5 h-5"
//                           fill="none"
//                           stroke="currentColor"
//                           viewBox="0 0 24 24"
//                         >
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth="3"
//                             d="M5 13l4 4L19 7"
//                           />
//                         </svg>
//                       )}
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>

//             {/* Action Button */}
//             <button
//               onClick={handleCreateGroup}
//               disabled={loading || !groupName || selectedMembers.length === 0}
//               className={`w-full py-4 rounded-2xl font-semibold text-sm transition-all duration-300 transform active:scale-[0.98] ${
//                 loading || !groupName || selectedMembers.length === 0
//                   ? "bg-gray-100 text-gray-400 cursor-not-allowed"
//                   : "bg-blue-600 text-white shadow-lg shadow-blue-200 hover:bg-blue-700"
//               }`}
//             >
//               {loading ? (
//                 <span className="flex items-center justify-center gap-2">
//                   <svg
//                     className="animate-spin h-4 w-4 text-current"
//                     viewBox="0 0 24 24"
//                   >
//                     <circle
//                       className="opacity-25"
//                       cx="12"
//                       cy="12"
//                       r="10"
//                       stroke="currentColor"
//                       strokeWidth="4"
//                       fill="none"
//                     />
//                     <path
//                       className="opacity-75"
//                       fill="currentColor"
//                       d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                     />
//                   </svg>
//                   Creating...
//                 </span>
//               ) : (
//                 "Create Group"
//               )}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CreateGroup;

import { useEffect } from "react";
import API from "../../utils/API";
import { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { X, Check, Loader2 } from "lucide-react";

const CreateGroup = ({ isOpen, setOpen }) => {
  const [groupName, setGroupName] = useState("");
  const [friends, setFriends] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((state) => state.auth);

  const fetchFriends = async () => {
    try {
      const res = await API.get("/friend");
      const myFriends = res.data?.data;
      const transformed = myFriends.map((f) => {
        const other = f.sender._id !== user._id ? f.sender : f.receiver;
        return {
          _id: f._id,
          userId: other._id,
          username: other.username,
          profilePic: other.profilePic,
        };
      });
      setFriends(transformed);
    } catch (error) {}
  };

  const handleCreateGroup = async () => {
    try {
      setLoading(true);
      const res = await API.post("/chat/create-group", {
        name: groupName,
        members: selectedMembers,
      });

      console.log(res.data?.data);
      toast.success(res.data?.message);
      setOpen(!isOpen);
      setSelectedMembers([]);
      setGroupName("");
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (friendId) => {
    if (selectedMembers.includes(friendId)) {
      setSelectedMembers(selectedMembers.filter((id) => id !== friendId));
    } else {
      setSelectedMembers([...selectedMembers, friendId]);
    }
  };

  useEffect(() => {
    fetchFriends();
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-[400px] mx-4 rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Create Group
            </h2>
            <button
              onClick={() => setOpen(false)}
              className="p-1.5 hover:bg-gray-100 rounded-full text-gray-400 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-5">
            {/* Input Section */}
            <div>
              <label className="block text-[13px] font-medium text-gray-500 mb-1.5 ml-0.5">
                Group Name
              </label>
              <input
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="What's the name?"
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
              />
            </div>

            {/* List Section */}
            <div>
              <div className="flex justify-between items-end mb-1.5 ml-0.5">
                <label className="block text-[13px] font-medium text-gray-500">
                  Select Members
                </label>
                <span className="text-[11px] text-gray-400 font-medium bg-gray-50 px-2 py-0.5 rounded-full">
                  {selectedMembers.length} selected
                </span>
              </div>

              <div className="max-h-52 overflow-y-auto border border-gray-100 rounded-xl bg-gray-50/30 p-1.5 space-y-1">
                {friends.length === 0 ? (
                  <div className="py-10 text-center">
                    <p className="text-gray-400 text-xs">
                      No friends available
                    </p>
                  </div>
                ) : (
                  friends.map((friend) => {
                    const isSelected = selectedMembers.includes(friend.userId);
                    return (
                      <div
                        key={friend.userId}
                        onClick={() => handleSelect(friend.userId)}
                        className={`flex items-center justify-between p-2.5 rounded-lg cursor-pointer transition-all ${
                          isSelected
                            ? "bg-white border-transparent shadow-sm ring-1 ring-blue-500/20"
                            : "hover:bg-gray-100/50 text-gray-600"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-full border border-gray-200 bg-gray-100 flex-shrink-0`}
                          />
                          <span
                            className={`text-sm font-medium ${isSelected ? "text-blue-600" : "text-gray-700"}`}
                          >
                            {friend.username}
                          </span>
                        </div>
                        {isSelected && (
                          <div className="bg-blue-600 rounded-full p-0.5">
                            <Check
                              size={12}
                              className="text-white"
                              strokeWidth={4}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Footer Button */}
            <button
              onClick={handleCreateGroup}
              disabled={loading || !groupName || selectedMembers.length === 0}
              className={`w-full py-3 rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-2 ${
                loading || !groupName || selectedMembers.length === 0
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-gray-900 text-white hover:bg-black active:scale-[0.98]"
              }`}
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Creating...</span>
                </>
              ) : (
                "Create Group"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateGroup;
