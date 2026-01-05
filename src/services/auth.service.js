import authRepo from "../repositories/auth.repo.js"
import devicesRepo from "../repositories/devices.repo.js"
import createError from "../utils/createError.util.js"
import bcrypt from "bcrypt"

class AuthService {
  /* ================= LOGIN ================= */
  async login(email, password) {
    const user = await authRepo.findUserByEmail(email)

    if (!user) {
      throw createError(401, "Không tìm thấy tài khoản")
    }

    if (user.is_deleted) {
      throw createError(404, "Tài khoản không tồn tại")
    }

    if (user.status === "INACTIVE") {
      throw createError(403, "Tài khoản này chưa được kích hoạt")
    }

    if (user.status === "BLOCKED") {
      throw createError(401, "Tài khoản đã bị khóa")
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      throw createError(401, "Sai mật khẩu")
    }

    // remove password
    const { password: _p, ...userWithoutPassword } = user
    return userWithoutPassword
  }
  //change pas
  changePassword = async (user_id, currentPassword, password, device_id) => {
    const {password: passwordHash} = await authRepo.getPasswordByID(user_id)
    const isMatch = await bcrypt.compare(currentPassword, passwordHash)
    if (!isMatch) {
      throw createError(403, "Sai mật khẩu")
    }
    const hash = await bcrypt.hash(password, 10)
    await authRepo.changePassword(user_id, hash)
    await devicesRepo.revokeAllDeviceWithoutMe(user_id,device_id)
    
   }
}

/* export singleton */
export default new AuthService()
