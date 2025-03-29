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

    socket.username = username;
    next();
  });

  io.on("connection", async (socket: Socket) => {
    logger.info(`Socket connected: ${socket.id}`);

    //#region calling
    socket.emit("me", socket.id);

    socket.on("join", (user: { fromUsername: string }) => {
      socket.join(user.fromUsername);

      const exists_user = online_users.find(
        (u) => u.name === user.fromUsername
      );
      if (exists_user) exists_user.socket_id = socket.id;
      else online_users.push({ name: user.fromUsername, socket_id: socket.id });
    });

    socket.on(
      "call:invite",
      (invitation: {
        signal: any;
        receiverUsername: string;
        callerUsername: string;
        callerSocketId: string;
      }) => {
        const online_user = online_users.find(
          (u) => u.name === invitation.receiverUsername
        );

        if (online_user) {
          io.to(online_user.socket_id).emit("call:invite", {
            signal: invitation.signal,
            receiverSocketId: online_user.socket_id,
            callerSocketId: invitation.callerSocketId,
            callerUsername: invitation.callerUsername,
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
        io.to(data.receiverSocketId).emit("call:accept", {
          signal: data.signal,
          callerSocketId: data.callerSocketId,
        });
      }
    );

    // call:rejected

    socket.on(
      "call:rejected",
      (data: { receiverUsername: string; callerSocketId: string }) => {
        io.to(data.callerSocketId).emit("call:rejected", {
          receiverUsername: data.receiverUsername,
        });
      }
    );

    socket.on(
      "call:ended",
      (data: { callEndedUsername: string; callerSocketId: string }) => {
        io.to(data.callerSocketId).emit("call:ended", {
          callEndedUsername: data.callEndedUsername,
        });
      }
    );

    //#endregion

    // Private message event handler
    socket.on("private message", (data: { to: string; message: any }) => {
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
    };

    // Initial user list update
    updateUserList();

    socket.broadcast.emit("user connected", {
      userID: socket.id,
      username: socket.username,
      key: socket.id,
      self: false,
    });

    socket.on("notification", (data: any) => {
      if (data?.receiver_username) {
        const user = online_users.find(
          (u) => u.name === data.receiver_username
        );

        console.log(162, { receiver_username: data.receiver_username, user });
        if (user) {
          io.to(user.socket_id).emit("notification", {
            ...data,
            createdAt: new Date(),
          });
        }
      } else
        socket.broadcast.emit("notification", {
          ...data,
          createdAt: new Date(),
        });
    });
    socket.on("is-able-to-chat", (data: any) => {
      const user = online_users.find((u) => u.name === data.menteeUserName);
      if (!user) return;

      io.to(user.socket_id).emit("is-able-to-chat", data);
    });
    socket.on("mentor-online", (data: any) => {
      socket.broadcast.emit("mentor-online", data);
    });

    socket.on("appointment-completed", (data: any) => {
      const user = online_users.find((u) => u.name === data.menteeUserName);
      if (!user) return;

      io.to(user.socket_id).emit("appointment-completed", data);
    });

    socket.on("disconnect", () => {
      online_users = online_users.filter((u) => u.socket_id !== socket.id);

      socket.broadcast.emit("user:disconnected", {
        disconnectedSocketId: socket.id,
      });

      // Update user list after disconnection
      updateUserList();
    });
  });

  return io;
};

export { initializeSocket, io };
