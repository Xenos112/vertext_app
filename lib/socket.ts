import { createServer } from "http";
import { Server } from "socket.io";
import prisma from "@/utils/prisma"; // adjust the import path if needed

// Set the port, defaulting to 3000 if not set in environment variables.
const PORT = process.env.PORT || 3001

// Create an HTTP server.
const httpServer = createServer();

// Initialize a new Socket.IO server instance attached to the HTTP server.
// You can configure CORS or other options here if needed.
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Define Socket.IO event handling.
io.on("connection", (socket) => {
  console.log("A user connected");

  // Handle joining a room.
  socket.on("joinRoom", (room: string) => {
    socket.join(room);
    console.log(`User joined room: ${room}`);
  });

  // Handle sending a message.
  socket.on("sendMessage", async ({ room, sender, content }: { room: string; sender: string; content: string; }) => {
    try {
      // Create a message record using Prisma.
      const message = await prisma.message.create({
        data: {
          content,
          senderId: sender,
          communityId: room,
        },
        include: {
          Sender: true,
        }
      });

      // Emit the newly created message to all clients in the room.
      io.to(room).emit("receiveMessage", message);
    } catch (error) {
      console.error("Error creating message:", error);
    }
  });

  // Handle disconnect event.
  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

// Start the HTTP server.
httpServer.listen(PORT, () => {
  console.log(`Socket server is running on port ${PORT}`);
});
