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
    });

    socket.on("disconnect", () => {
      console.log("A user disconnected");
    });
  });
};
