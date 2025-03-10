"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = exports.initializeSocket = void 0;
const socket_io_1 = require("socket.io");
const logger_1 = require("../shared/logger");
let io;
const initializeSocket = (server) => {
    exports.io = io = new socket_io_1.Server(server, {
        cors: {
            origin: "*", // Adjust this according to your CORS policy
            methods: ["GET", "POST"],
            credentials: true,
        },
    });
    io.use((socket, next) => {
        const username = socket.handshake.auth.username;
        console.log(" From Use Username:", username);
        socket.username = username;
        next();
    });
    io.on("connection", (socket) => {
        console.log("User connected:", socket.id);
        logger_1.logger.info(`Socket connected: ${socket.id}`);
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
            // Update user list after disconnection
            updateUserList();
        });
    });
    return io;
};
exports.initializeSocket = initializeSocket;
