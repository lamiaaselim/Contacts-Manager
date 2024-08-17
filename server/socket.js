const http = require("http");
const { Server } = require("socket.io");
const app = require("./app"); // Import the Express app

// Create an HTTP server using the Express app
const serverSocket = http.createServer(app);

// Initialize `socket.io` with the HTTP server
const io = new Server(serverSocket, {
  cors: {
    origin: "*", // Adjust this according to your CORS settings
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

module.exports = { serverSocket, io };
