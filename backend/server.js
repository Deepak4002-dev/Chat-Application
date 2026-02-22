import app from "./app.js";
import { createServer } from "http";
import { PORT } from "./config/constants.js";
import { initSocket } from "./config/socket.js";

const server = createServer(app);

// Initialize socket AFTER creating the http server
initSocket(server);

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});


// Handle unexpected errors — prevent server crash
process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION:", err.message);
  server.close(() => process.exit(1));
});

process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION:", err.message);
  process.exit(1);
});