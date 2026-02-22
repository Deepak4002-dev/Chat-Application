import { Server } from "socket.io";
import cookie from 'cookie'
import { verifyToken } from "../utils/verifyToken.js";

let io;

export const initSocket = (httpServer)=>{
  io = new Server(httpServer,{
    cors:{
      origin:"http://localhost:5173",
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
      credentials: true,
    }
  })

  io.use((socket,next)=>{
    try {
      const cookies = cookie.parse(socket.handshake.headers.cookie || "");
      const accessToken = cookies.accessToken;
      const decoded = verifyToken(accessToken);
      socket.user = decoded;
      next()

    } catch (error) {
      next(error);
    }
  })

   io.on("connection", (socket) => {
    console.log(`✅ Socket connected: ${socket.id}`);
    
    // join a personal room using userId so you can emit to specific users later
    socket.on("join", (userId) => {
      socket.join(userId);
      console.log(`User ${userId} joined room ${userId}`);
    });

    socket.on("disconnect", () => {
      console.log(`❌ Socket disconnected: ${socket.id}`);
    });
  });

  return io
}

export const getIO = () => {
  if (!io) throw new Error("Socket.io not initialized. Call initSocket first.");
  return io;
};