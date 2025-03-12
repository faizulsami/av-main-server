/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
// @ts-nocheck

import { Server as HTTPServer } from "http";
import { Server as SocketIOServer, Socket } from "socket.io";

import { logger } from "../shared/logger";

let io: SocketIOServer;
let online_users: { name: string; socket_id: string }[] = [];

const initializeSocket = (server: HTTPServer) => {
  io = new SocketIOServer(server, {
    pingTimeout: 60000,
    cors: {
      origin: "*", // Adjust this according to your CORS policy
      credentials: true,
    },
  });

  io.use((socket, next) => {
    const username = socket.handshake.auth.username;
    console.log(" From Use Username:", username);
    socket.username = username;
    next();
  });

  io.on("connection", async (socket: Socket) => {
    console.log("User connected:", socket.id);
    logger.info(`Socket connected: ${socket.id}`);

    //#region calling
    socket.emit("me", socket.id);

    socket.on("join", (user: { fromUsername: string }) => {
      console.log("this is also me why");
      socket.join(user.fromUsername);

      const exists_user = online_users.find(
        (u) => u.name === user.fromUsername
      );
      if (exists_user) exists_user.socket_id = socket.id;
      else online_users.push({ name: user.fromUsername, socket_id: socket.id });

      // io.emit("online_users", online_users);
      console.log({ online_users });
    });

    socket.on(
      "call:invite",
      (invitation: {
        signal: any;
        receiverUsername: string;
        callerSocketId: string;
      }) => {
        const online_user = online_users.find(
          (u) => u.name === invitation.receiverUsername
        );
        console.log({ online_users });
        if (online_user) {
          io.to(online_user.socket_id).emit("call:invite", {
            signal: invitation.signal,
            receiverSocketId: online_user.socket_id,
            callerSocketId: invitation.callerSocketId,
          });
        }
      }
    );

    socket.on(
      "call:accept",
      (data: {
        receiverSocketId: string;
        callerSocketId: string;
        signal: any;
      }) => {
        console.log("call:accept");
        io.to(data.receiverSocketId).emit("call:accept", {
          signal: data.signal,
          callerSocketId: data.callerSocketId,
        });
      }
    );

    //#endregion

    // Private message event handler
    socket.on("private message", (data: { to: string; message: any }) => {
      console.log("Private message:", data);

      // Find the target socket by username instead of socket ID
      const targetSocket = Array.from(io.sockets.sockets.values()).find(
        (s) => s.username === data.to
      );

      if (targetSocket) {
        // Emit the private message to the specific user
        targetSocket.emit("private message", {
          from: socket.id,
          fromUsername: socket.username,
          message: data.message,
        });

        // Optional: Send confirmation to the sender
        socket.emit("message sent", {
          to: data.to,
          message: data.message,
        });
      } else {
        // If target socket not found, send an error back to the sender
        socket.emit("private message error", {
          to: data.to,
          message: "User not found",
        });
      }
    });

    // Send connected users list to the client
    const updateUserList = () => {
      const users = [];
      for (const [id, socket] of io.of("/").sockets) {
        users.push({
          userID: id,
          username: socket.username,
          key: id,
        });
      }
      io.emit("users", users);
      console.log("Connected users:", users);
    };

    // Initial user list update
    updateUserList();

    socket.broadcast.emit("user connected", {
      userID: socket.id,
      username: socket.username,
      key: socket.id,
      self: false,
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
      logger.info(`Socket disconnected: ${socket.id}`);
      online_users = online_users.filter((u) => u.socket_id !== socket.id);
      // Update user list after disconnection
      updateUserList();
    });
  });

  return io;
};

export { initializeSocket, io };
