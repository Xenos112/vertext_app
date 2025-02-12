// app/api/socket/route.ts
import { NextResponse } from "next/server";
import { Server } from "socket.io";
import { initSocket } from "@/lib/socket"; // Adjust the path accordingly

export const GET = (req: Request) => {
  try {
    const server = req.socket.server;
    if (!server.io) {
      const io = new Server(server, {
        path: "/api/socket", // Make sure this matches the path on the client-side
        transports: ["websocket"], // WebSocket transport
      });

      initSocket(io); // Pass the io instance to initialize socket events
      server.io = io; // Prevent reinitializing the socket server
    }
    return NextResponse.json({ message: "Socket server initialized" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Socket initialization failed" },
      { status: 500 },
    );
  }
};
