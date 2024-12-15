import { Server as NetServer } from "http";
import { Server as ServerIO } from "socket.io";
import { NextApiResponse } from "next";

export type NextApiResponseServerIO = NextApiResponse & {
  socket: any & {
    server: NetServer & {
      io: ServerIO;
    };
  };
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export function initSocket(res: NextApiResponseServerIO) {
  if (!res.socket.server.io) {
    const io = new ServerIO(res.socket.server, {
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

    res.socket.server.io = io;
  }
  return res.socket.server.io;
}
