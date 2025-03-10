/* eslint-disable @typescript-eslint/no-explicit-any */
import { Socket, Server } from "socket.io";

let online_users: { name: string; socket_id: string }[] = [];

export interface CallInvitation {
  // caller: string;
  // callee: string;
  roomId: string;
  from: string;
  to: string;
  type: "video" | "audio";
}

export const socketCallHandler = async (socket: Socket, io: Server) => {
  socket.emit("me", socket.id);

  // call:invite
  socket.on("join", (user: { fromUsername: string }) => {
    socket.join(user.fromUsername);

    const exists_user = online_users.find((u) => u.name === user.fromUsername);
    if (exists_user) exists_user.socket_id = socket.id;
    else online_users.push({ name: user.fromUsername, socket_id: socket.id });

    // io.emit("online_users", online_users);
  });

  socket.on("call:invite", (invitation: CallInvitation) => {
    console.log({ name: invitation.from });
    const online_user = online_users.find((u) => u.name === invitation.from);
    if (online_user) {
      io.to(online_user.socket_id).emit("call:invite", {
        signal: data.signal,
        from: data.from,
        name: data.name,
      });
    }
  });

  socket.on("accept_call", (data: { signal: any; to: string; me: string }) => {
    io.to(data.to).emit("call_accepted", { signal: data.signal, me: data.me });
  });

  socket.on("disconnect", () => {
    online_users = online_users.filter((u) => u.socket_id !== socket.id);
  });

  console.log(online_users);
};
