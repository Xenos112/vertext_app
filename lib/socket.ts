import { createServer } from "http";
import { Server } from "socket.io";
import prisma from "@/utils/prisma";


// FIX: define the port in the .env file
// FIX: make it in /chat and add notification socket
const PORT = process.env.SOCKET_PORT || 3001

const httpServer = createServer();

const io = new Server(httpServer, {
  cors: {
    // HACK: only allow port 3000
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("joinRoom", (room: string) => {
    socket.join(room);
    console.log(`User joined room: ${room}`);
  });

  socket.on("sendMessage", async ({ room, sender, content }: { room: string; sender: string; content: string; }) => {
    try {
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

      io.to(room).emit("receiveMessage", message);
    } catch (error) {
      console.error("Error creating message:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

httpServer.listen(PORT, () => {
  console.log(`Socket server is running on port ${PORT}`);
});
