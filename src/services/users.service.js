// src/services/users.service.js
import userRepo from "../repositories/users.repo.js"
import authRepo from "../repositories/auth.repo.js"
import createError from "../utils/createError.util.js"
import bcrypt from "bcrypt"

class UserService {

  async getUsers() {
    return userRepo.getUsers()
  }

  async addOneUser(payload) {
    const { full_name, email, password, role_id } = payload

    const exist = await authRepo.findUserByEmail(email)
    if (exist) throw createError(409, "Email đã tồn tại")

    const hashed = await bcrypt.hash(password, 10)

    const created = await userRepo.addOneUser({
      full_name,
      email,
      password: hashed,
      role_id
    })

    if (!created) throw createError(500, "Tạo user thất bại")

    return created
  }

  async deleteSoftware(id) {
    if (!id) throw createError(400, "Thiếu id")

    const isAdmin = (await userRepo.getRoleByID(id)) === 1
    if (isAdmin) {
      throw createError(403, "Không thể xóa quản trị viên")
    }

    const result = await userRepo.deleteSoftware(id)
    if (!result) throw createError(500, "Lỗi khi xóa user")
  }

  async updateUser(id, payload) {
    if (!id) throw createError(400, "Thiếu id")

    const isAdmin = (await userRepo.getRoleByID(id)) === 1
    if (isAdmin) {
      throw createError(403, "Không có quyền thực hiện với quản trị viên khác")
    }

    if (!payload || Object.keys(payload).length === 0) {
      throw createError(400, "Không có dữ liệu cập nhật")
    }

    if (payload.role_name) {
      const role = await userRepo.findRoleByName(payload.role_name)
      if (!role) throw createError(400, "Role không hợp lệ")
      payload.role_id = role.id
      delete payload.role_name
    }

    const ALLOWED_FIELDS = ["full_name", "email", "status", "role_id"]
    const dataToUpdate = {}

    for (const key of ALLOWED_FIELDS) {
      if (payload[key] !== undefined) {
        dataToUpdate[key] = payload[key]
      }
    }

    if (Object.keys(dataToUpdate).length === 0) {
      throw createError(400, "Field cập nhật không hợp lệ")
    }

    if (dataToUpdate.email) {
      const exist = await findUserByEmail(dataToUpdate.email)
      if (exist && exist.id !== Number(id)) {
        throw createError(409, "Email đã tồn tại")
      }
    }

    const updated = await userRepo.updateUser(id, dataToUpdate)
    if (!updated) throw createError(404, "Không tìm thấy user")

    return updated
  }

  async getProfile(id) {
    const prof = await userRepo.getProfile(id)

    if (!prof) throw createError(404, "Không tìm thấy profile người dùng")
    if (prof.status === "BLOCKED") throw createError(403, "Tài khoản đã bị khóa")
    if (prof.is_deleted) throw createError(404, "Tài khoản đã bị xóa")

    return prof
  }

  async updateProfile(fields, id) {
    const updated = await userRepo.updateProfile(fields, id)
    if (!updated) throw createError(404, "Không tìm thấy profile")
    const newProfile = await userRepo.getProfile(id)
    
    return newProfile
  }
}

export default new UserService()
