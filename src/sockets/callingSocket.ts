/* eslint-disable @typescript-eslint/no-explicit-any */
import { Socket, Server } from "socket.io";

export interface CallInvitation {
  // caller: string;
  // callee: string;
  roomId: string;
  from: string;
  to: string;
  type: "video" | "audio";
}

interface SocketCallHandler {
  socket: Socket;
  io: Server;
  online_users: { name: string; socket_id: string }[];
}
export const socketCallHandler = async ({
  socket,
  io,
  online_users,
}: SocketCallHandler) => {
  socket.emit("me", socket.id);

  // call:invite
  console.log("hmm", socket.id);

  socket.on("join", (user: { fromUsername: string }) => {
    console.log("this is also me why");
    socket.join(user.fromUsername);

    const exists_user = online_users.find((u) => u.name === user.fromUsername);
    if (exists_user) exists_user.socket_id = socket.id;
    else online_users.push({ name: user.fromUsername, socket_id: socket.id });

    // io.emit("online_users", online_users);
  });
  interface CallInvitationExtends extends CallInvitation {
    fromId: string;
    toId: string;
  }
  socket.on("call:invite", (invitation: CallInvitationExtends) => {
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

  socket.on("accept_call", (data: { signal: any; to: string; me: string }) => {
    io.to(data.to).emit("call_accepted", { signal: data.signal, me: data.me });
  });
};
