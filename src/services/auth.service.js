import { findUserByEmail } from "../repositories/auth.repo.js"
import createError from "../utils/createError.util.js"
import bcrypt from "bcrypt"

//LOGIN ============================================================
const login = async (email, password) => {
    const user = await findUserByEmail(email)
    if (!user){
        throw createError(401, "không tìm thấy tài khoản")
    }
    const isMatch = await bcrypt.compare(password, user.password)

    if (isMatch) {
        const {password, ...userWithoutPassword} = user
        return userWithoutPassword
    }
    throw createError(401, "Sai mật khẩu")
}

export {login}