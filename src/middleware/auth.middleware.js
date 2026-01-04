
import authRepo from "../repositories/auth.repo.js";
import { verifyAccessToken } from "../utils/jwt.util.js"
import createError from "../utils/createError.util.js"

const authMiddleware = async  (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw createError(401, "Chưa đăng nhập")
    }
    const accessToken = authHeader.split(" ")[1];
    const payload = verifyAccessToken(accessToken)
    const user = await authRepo.findUserByID(payload.id)
    if (user.status === "INACTIVE")
      throw createError(403, "Tài khoản chưa được kích hoạt")
    if (user.is_deleted)
      throw createError(401, "Tài khoản không tồn tại")
    if (user.status === "BLOCKED")
      throw createError(401, "Tài khoản bị khóa ")
    req.user = payload
    next();
  } catch (err) {
    // Nếu token hết hạn hoặc không hợp lệ, trả về 401 rõ ràng
    if (err && err.name === "TokenExpiredError") {
      return next(createError(401, "Token hết hạn"))
    }

    if (err && err.name === "JsonWebTokenError") {
      return next(createError(401, "Token không hợp lệ"))
    }

    next(err);
  }
}
export default authMiddleware