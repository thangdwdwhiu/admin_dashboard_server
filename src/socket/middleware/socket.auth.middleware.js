import { verifyAccessToken } from "../../utils/jwt.util.js";
export const socketAuthMiddleware = (socket, next) => {
  try {
    const token = socket.handshake.auth?.token;
    console.log("Socket handshake token:", token);

    if (!token) return next(new Error("Unauthorized"));

    const payload = verifyAccessToken(token);
    socket.user = payload; // gán đúng payload
    next();
  } catch (err) {
    
    next(new Error("Unauthorized"));
  }
}
