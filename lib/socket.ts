// utils/socket.ts
import prisma from "@/utils/prisma";
import { Server } from "socket.io";

export const initSocket = (io: Server) => {
  io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on("joinRoom", (room) => {
      socket.join(room);
      console.log(`User joined room: ${room}`);
    });

    socket.on("sendMessage", async ({ room, sender, content }) => {
      // Save the message to the database using Prisma
      const message = await prisma.message.create({
        data: {
          content,
          senderId: sender,
          communityId: room,
        },
      });

      // Emit the message to all users in the room
      io.to(room).emit("receiveMessage", message);
    });

    socket.on("disconnect", () => {
      console.log("A user disconnected");
    });
  });
};
