import { Server as NetServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import { NextApiResponse } from "next";

export type NextApiResponseServerIO = NextApiResponse & {
  socket: any;
};

export function initSocket(server: NetServer) {
  if (!(server as any).io) {
    const io = new SocketIOServer(server, {
      path: "/api/socket",
      addTrailingSlash: false,
      cors: {
        origin: "*",
      },
    });

    io.on("connection", (socket) => {
      console.log("Socket connected:", socket.id);

      socket.on("join-chat", (conversationId: string) => {
        socket.join(conversationId);
      });

      socket.on("leave-chat", (conversationId: string) => {
        socket.leave(conversationId);
      });

      socket.on("send-message", (message) => {
        io.to(message.conversationId).emit("new-message", message);
      });

      socket.on("disconnect", () => {
        console.log("Socket disconnected:", socket.id);
      });
    });

    (server as any).io = io;
  }
  return (server as any).io;
}
