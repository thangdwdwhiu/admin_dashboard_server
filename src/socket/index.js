import { Server } from "socket.io"
import { socketAuthMiddleware } from "./middleware/socket.auth.middleware.js"

let io


export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.URL_CLIENT,
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH", "OPTIONS", "DELETE"]
    }
  })

  io.use(socketAuthMiddleware)

  io.on("connection", (socket) => {
    const {id: user_id, device_id} = socket.user
    console.log("=> Socket connected:", user_id, device_id)

    socket.join(`user:${user_id}`)
    socket.join(`device:${device_id}`)
  socket.on("disconnect", (reason) => {
    console.log("!Socket disconnected:", socket.user.id, "Reason:", reason);
  });
  })

  return io
}

export const getIO = () => {
  if (!io) throw new Error("Socket.io not initialized")
  return io
}
