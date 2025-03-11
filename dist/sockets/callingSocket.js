"use strict";
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
exports.socketCallHandler = void 0;
const socketCallHandler = (_a) => __awaiter(void 0, [_a], void 0, function* ({ socket, io, online_users, }) {
    socket.emit("me", socket.id);
    // call:invite
    console.log("hmm", socket.id);
    socket.on("join", (user) => {
        console.log("this is also me why");
        socket.join(user.fromUsername);
        const exists_user = online_users.find((u) => u.name === user.fromUsername);
        if (exists_user)
            exists_user.socket_id = socket.id;
        else
            online_users.push({ name: user.fromUsername, socket_id: socket.id });
        // io.emit("online_users", online_users);
    });
    socket.on("call:invite", (invitation) => {
        console.log({ name: invitation.from });
        const online_user = online_users.find((u) => u.name === invitation.from);
        console.log({ online_users });
        if (online_user) {
            io.to(online_user.socket_id).emit("call:invite", {
                from: invitation.from,
                roomId: invitation.roomId,
                to: online_user.name,
            });
        }
    });
    socket.on("accept_call", (data) => {
        io.to(data.to).emit("call_accepted", { signal: data.signal, me: data.me });
    });
});
exports.socketCallHandler = socketCallHandler;
