import authRepo from "../repositories/auth.repo.js"
import authService from "../services/auth.service.js"
import createError from "../utils/createError.util.js"
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt.util.js"

class AuthController {
  /* ================= LOGIN ================= */
  login = async (req, res, next) => {
    try {
      const { email, password } = req.body

      const user = await authService.login(email, password)

      const payload = {
        id: user.id,
        role: user.role_id,
      }

      const accessToken = signAccessToken(payload)
      const refreshToken = signRefreshToken(payload)

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

      const { id, role } = verifyRefreshToken(refreshToken)
      const newAccessToken = signAccessToken({ id, role })

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

      const { id, role } = verifyRefreshToken(refreshToken)
      const newAccessToken = signAccessToken({ id, role })

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
      const isProduction = process.env.NODE_ENV === "production"

      res.clearCookie("refreshToken", {
        httpOnly: true,
        sameSite: isProduction ? "none" : "lax",
        secure: isProduction,
      })

      res.status(200).json({
        success: true,
        message: "Đăng xuất thành công",
      })
    } catch (err) {
      next(err)
    }
  }
}

export default new AuthController()
