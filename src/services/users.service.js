import * as userRepo from "../repositories/users.repo.js"
import { findUserByEmail } from "../repositories/auth.repo.js"
import createError from "../utils/createError.util.js"
import bcrypt from "bcrypt"

/* ================= GET USERS ================= */
const getUsers = async () => {
  return await userRepo.getUsers()
}

/* ================= ADD USER ================= */
const addOneUser = async (payload) => {
  const { full_name, email, password, role_id } = payload

  const exist = await findUserByEmail(email)
  if (exist) throw createError(409, "Email đã tồn tại")

  const hashed = await bcrypt.hash(password, 10)

  const created = await userRepo.addOneUser({
    full_name,
    email,
    password: hashed,
    role_id
  })

  if (!created) throw createError(500, "Tạo user thất bại")

  const { password: _p, ...userWithoutPassword } = created
  return userWithoutPassword
}

/* ================= DELETE USER (SOFT) ================= */
const deleteSoftware = async (id) => {
  if (!id) throw createError(400, "Thiếu id")

  const result = await userRepo.deleteSoftware(id)
  if (!result) throw createError(500, "Lỗi khi xóa user")
}

/* ================= UPDATE USER (PATCH) ================= */
const updateUser = async (id, payload) => {
  if (!id) throw createError(400, "Thiếu id")

  // Không cho update rỗng
  if (!payload || Object.keys(payload).length === 0) {
    throw createError(400, "Không có dữ liệu cập nhật")
  }

  /* ===== Nếu client gửi role_name thì map sang role_id ===== */
  if (payload.role_name) {
    const role = await userRepo.findRoleByName(payload.role_name)
    if (!role) throw createError(400, "Role không hợp lệ")
    // chuyển role_name => role_id để cập nhật đúng cột trong DB
    payload.role_id = role.id
    delete payload.role_name
  }

  /* ===== Whitelist field được phép update ===== */
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

  /* ===== Check email nếu update ===== */
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

export {
  getUsers,
  addOneUser,
  deleteSoftware,
  updateUser
}
