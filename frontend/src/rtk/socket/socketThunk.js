import { socket } from "../../utils/Socket"
import { setOnlineUsers,setConnected,addFriendRequest } from "./socketSlice.js"

export const connectSocket = (userId)=> (dispatch)=>{

  // Clean up all listeners FIRST to prevent stacking
  socket.off("connect");
  socket.off("connect_error");
  socket.off("getOnlineUsers");
  socket.off("newRequest");

  // Register listeners BEFORE connecting so no event is missed
  socket.on("connect", () => {
    console.log("[Socket] ✅ Connected, id:", socket.id, "userId:", userId);
    dispatch(setConnected(true));
    socket.emit("addUser", userId);
  });

  socket.on("connect_error", (err) => {
    console.error("[Socket] ❌ Connection failed:", err.message);
  });

  socket.on("getOnlineUsers",(users)=>{
    dispatch(setOnlineUsers(users))
  })

  socket.on("newRequest", (data) => {
    console.log("[Socket] 🔔 newRequest received:", data);
    dispatch(addFriendRequest(data))
  });

  if (socket.connected) {
    // Already connected — manually dispatch since "connect" won't fire again
    console.log("[Socket] Already connected, skipping reconnect");
    dispatch(setConnected(true));
  } else if (socket.active) {
    // socket.active = true means it is already in a connecting/reconnecting state
    // Do NOT call connect() again — just wait for the "connect" event to fire
    console.log("[Socket] Already connecting, waiting...");
  } else {
    console.log("[Socket] Connecting for userId:", userId);
    socket.connect();
  }
}

export const disconnectSocket = ()=> {
  return (dispatch)=>{
  socket.off("connect");
  socket.off("connect_error");
  socket.off("getOnlineUsers");
  socket.off("newRequest");
  socket.disconnect()
  dispatch(setConnected(false))
  }
}