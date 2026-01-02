import { findUserByID } from "../repositories/auth.repo.js";
import * as authService from "../services/auth.service.js";
import createError from "../utils/createError.util.js";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt.util.js";

// LOGIN CONTROLLER  ===========================
const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const userWithoutPassword = await authService.login(email, password);
    const payload = {
      id: userWithoutPassword.id,
      role: userWithoutPassword.role_id,
    };
    // tao access token
    const accessToken = signAccessToken(payload);
    // tao refresh token
    const refreshToken = signRefreshToken(payload);
    // set cookie
    const isProduction = process.env.NODE_ENV == "production";

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      path: "/",
      secure: isProduction ? true : false,
      sameSite: isProduction ? "none" : "lax",
    });

    // Trả về
    res.status(200).json({
      success: true,
      message: "Đăng nhập thành công",
      accessToken: accessToken,
      user: userWithoutPassword,
    });
  } catch (err) {
    next(err);
  }
};

//CHECK AUTH
const checkAuth = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      throw createError(401, "Refresh token hết hạn!");
    }
    const { id, role } = verifyRefreshToken(refreshToken);
    const newAccessToken = signAccessToken({ id, role });
    const user = await findUserByID(id);
    delete user.password;
    res.status(200).json({
      success: true,
      accessToken: newAccessToken,
      user,
    });
  } catch (err) {
    next(err);
  }
};

// REFRESH
const refresh = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      throw createError(401, "Refresh token hết hạn!");
    }
    const { id, role } = verifyRefreshToken(refreshToken);
    const newAccessToken = signAccessToken({ id, role });
    const user = await findUserByID(id);
    if (user) delete user.password;
    res.status(200).json({
      success: true,
      accessToken: newAccessToken,
      user,
    });
  } catch (err) {
    next(err);
  }
};
// LOGOUT
const logout = async (req, res, next) => {
    const isProduction = process.env.NODE_ENV === "production"
  try {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      sameSite: isProduction ? "none" : "lax",
      secure: isProduction,
    })
    res.status(200).json({
      success: true,
      message: "Đăng xuất thành công người dùng",
    });
  } catch (err) {
    next(err)
  }
};

export { login, checkAuth, refresh, logout };
