
import { findUserByID } from "../repositories/auth.repo.js";
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
    const user = await findUserByID(payload.id)
    if (user.is_deleted || user.status === "BLOCKED"){
      throw createError(401, "Tài khoản bị khóa ")
    }
    req.user = payload
    next();
  } catch (err) {
    next(err);
  }
}
export default authMiddleware