import { Server } from "socket.io";
import cookie from "cookie";
import { verifyToken } from "../utils/verifyToken.js";
import Chat from "../models/Chat.js";

let io;

export const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
      credentials: true,
    },
  });

  io.use((socket, next) => {
    try {
      const cookies = cookie.parse(socket.handshake.headers.cookie || "");
      const accessToken = cookies.accessToken;
      const decoded = verifyToken(accessToken);
      socket.user = decoded;
      next();
    } catch (error) {
      next(new Error("Authentication Error"));
    }
  });

  io.on("connection", async (socket) => {
    const room = socket.user._id.toString();
    console.log(`✅ Socket connected: ${socket.id} | joining room: ${room}`);

    socket.join(room);

    try {
      const groupRooms = await Chat.find({ members: socket.user._id, isGroup: true });
      for (let grpRoom of groupRooms) {
        socket.join(grpRoom._id.toString());
      }
    } catch (error) {
      // Log and continue — don't throw, socket must stay connected
      console.error(`[Socket] Failed to join group rooms for ${room}:`, error.message);
    }

    socket.on("disconnect", () => {
      console.log(`❌ Socket disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) throw new Error("Socket.io not initialized. Call initSocket first.");
  return io;
};
