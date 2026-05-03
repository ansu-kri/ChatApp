const { Server, Socket } = require("socket.io")

let io;
const onlineUsers = new Map(); // userId -> socketId

const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: process.env.CLIENT_URL || "http://localhost:5173",
            credentials: true,
        }
    });

    io.on("connection", (socket) => {
        const userId = socket.handshake.query.userId;

        if (userId) {
            onlineUsers.set(userId, socket.id);
            io.emit("onlineUsers", Array.from(onlineUsers.keys()));
            console.log(`User ${userId} connected (${socket.id})`);
        }

        //join a channel/room
        socket.on("joinChannel", (channelId) =>{
            socket.join(ChannelId)
        });

        //Leave a channel/room
        socket.on("leaveChannel", (channelId) => {
            socket.leave(channelId);
        });

        //Typing indicators
        socket.on("typing", ({ channelId, userId, isTyping}) => {
            socket.to(channelId).emit("userTyping", { userId, isTyping });
        });

        socket.on("disconnect", () => {
            if(userId) {
                onlineUsers.delete(userId);
                io.emit("onlineUsers", Array.from(onlineUsers.keys()));
                console.log(`User ${userId} disconnected`);
            }
        });
    });

    return io;
};

const getIO = () => {
    if(!io) throw new Error("Socket.io not initialized");
    return io;
};

const getOnlineUsers = () => onlineUsers;

module.exports = { initSocket, getIO, getOnlineUsers };