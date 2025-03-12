"use strict";
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
// @ts-nocheck
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = exports.initializeSocket = void 0;
const socket_io_1 = require("socket.io");
const logger_1 = require("../shared/logger");
let io;
let online_users = [];
const initializeSocket = (server) => {
    exports.io = io = new socket_io_1.Server(server, {
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
    io.on("connection", (socket) => __awaiter(void 0, void 0, void 0, function* () {
        console.log("User connected:", socket.id);
        logger_1.logger.info(`Socket connected: ${socket.id}`);
        //#region calling
        socket.emit("me", socket.id);
        socket.on("join", (user) => {
            console.log("this is also me why");
            socket.join(user.fromUsername);
            const exists_user = online_users.find((u) => u.name === user.fromUsername);
            if (exists_user)
                exists_user.socket_id = socket.id;
            else
                online_users.push({ name: user.fromUsername, socket_id: socket.id });
            // io.emit("online_users", online_users);
            console.log({ online_users });
        });
        socket.on("call:invite", (invitation) => {
            const online_user = online_users.find((u) => u.name === invitation.receiverUsername);
            console.log({ online_users });
            if (online_user) {
                io.to(online_user.socket_id).emit("call:invite", {
                    signal: invitation.signal,
                    receiverSocketId: online_user.socket_id,
                    callerSocketId: invitation.callerSocketId,
                });
            }
        });
        socket.on("call:accept", (data) => {
            console.log("call:accept");
            socket.emit("call:accept", {
                signal: data.signal,
                callerSocketId: data.callerSocketId,
            });
        });
        //#endregion
        // Private message event handler
        socket.on("private message", (data) => {
            console.log("Private message:", data);
            // Find the target socket by username instead of socket ID
            const targetSocket = Array.from(io.sockets.sockets.values()).find((s) => s.username === data.to);
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
            }
            else {
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
            logger_1.logger.info(`Socket disconnected: ${socket.id}`);
            online_users = online_users.filter((u) => u.socket_id !== socket.id);
            // Update user list after disconnection
            updateUserList();
        });
    }));
    return io;
};
exports.initializeSocket = initializeSocket;
