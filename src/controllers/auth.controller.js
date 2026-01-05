import authRepo from "../repositories/auth.repo.js"
import authService from "../services/auth.service.js"
import createError from "../utils/createError.util.js"
import { getClientIp } from "../utils/getClientIp.util.js"

import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt.util.js"

class AuthController {
  /* ================= LOGIN ================= */
  login = async (req, res, next) => {
    try {
      if (req.cookies.refreshToken){
        throw createError(403, "Đã đăng nhập rồi")
      }
      const { email, password , device} = req.body
      const user = await authService.login(email, password)
      const payload = {
        id: user.id,
        role: user.role_id,
        device_id: device.device_id
      }

      const accessToken = signAccessToken(payload)
      const refreshToken = signRefreshToken(payload)
      const ipAddress = getClientIp(req)

      // SAVE SESSION INTO DB
      const user_devices = await authRepo.saveSession(user.id, refreshToken, ipAddress,device)
      const isProduction = process.env.NODE_ENV === "production"

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        path: "/",
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
      })

      res.status(200).json({
        success: true,
        message: "Đăng nhập thành công",
        accessToken,
        user,
        user_devices
      })
    } catch (err) {
      next(err)
    }
  }

  /* ================= CHECK AUTH ================= */
  checkAuth = async (req, res, next) => {
    try {
      const refreshToken = req.cookies?.refreshToken
      if (!refreshToken) {
        throw createError(401, "Refresh token hết hạn!")
      }

      const { id, role, device_id } = verifyRefreshToken(refreshToken)
      const newAccessToken = signAccessToken({ id, role, device_id })

      const user = await authRepo.findUserByID(id)
      if (user) delete user.password

      res.status(200).json({
        success: true,
        accessToken: newAccessToken,
        user,
      })
    } catch (err) {
      next(err)
    }
  }

  /* ================= REFRESH ================= */
  refresh = async (req, res, next) => {
    try {
      const refreshToken = req.cookies?.refreshToken
      if (!refreshToken) {
        throw createError(401, "Refresh token hết hạn!")
      }

      const { id, role, device_id } = verifyRefreshToken(refreshToken)
      const newAccessToken = signAccessToken({ id, role, device_id })

      const user = await authRepo.findUserByID(id)
      if (user) delete user.password

      res.status(200).json({
        success: true,
        accessToken: newAccessToken,
        user,
      })
    } catch (err) {
      next(err)
    }
  }

  /* ================= LOGOUT ================= */
  logout = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    const isProduction = process.env.NODE_ENV === "production";

    if (!refreshToken) {
      // Không có token → vẫn coi là logout thành công
      res.clearCookie("refreshToken", {
        httpOnly: true,
        sameSite: isProduction ? "none" : "lax",
        secure: isProduction,
      });

      return res.status(200).json({
        success: true,
        message: "Đã đăng xuất",
      });
    }

    let payload;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch (e) {
      // refresh token sai / hết hạn → vẫn logout client
      res.clearCookie("refreshToken", {
        httpOnly: true,
        sameSite: isProduction ? "none" : "lax",
        secure: isProduction,
      });

      return res.status(200).json({
        success: true,
        message: "Đã đăng xuất",
      });
    }

    const { userId, deviceId } = payload;

    // revoke device (best effort)
    if (userId && deviceId) {
      await authRepo.revokeDevice(userId, deviceId);
    }

    res.clearCookie("refreshToken", {
      httpOnly: true,
      sameSite: isProduction ? "none" : "lax",
      secure: isProduction,
    });

    return res.status(200).json({
      success: true,
      message: "Đăng xuất thành công",
    });
  } catch (err) {
    next(err);
  }
}
//change password
  async changePassword (req, res, next)
  {
    try {
      const {id: user_id} = req.user
      const {password, currentPassword} = req.body
      await authService.changePassword(user_id,currentPassword,password,req.user.device_id)
      res.status(200).json({
        success: true,
        message: "đổi mật khẩu thành công"
      })
    }
    catch (err){
      next(err)
    }
  }

}

export default new AuthController()
