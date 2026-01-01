
import { verifyAccessToken } from "../utils/jwt.util.js"

const authMiddleware =  (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Chưa đăng nhập",
      });
    }
    const accessToken = authHeader.split(" ")[1];
    const payload = verifyAccessToken(accessToken);
    req.user = payload;
    next();
  } catch (err) {
    next(err);
  }
}
export default authMiddleware