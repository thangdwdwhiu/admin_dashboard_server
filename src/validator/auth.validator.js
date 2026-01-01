import { body } from "express-validator"

const loginValidator = [
  body("email")
    .trim()
    .notEmpty().withMessage("Email không được để trống")
    .isEmail().withMessage("Email không đúng định dạng")
    .normalizeEmail(),

  body("password")
    .notEmpty().withMessage("Mật khẩu không được để trống")
    .isLength({ min: 8 }).withMessage("Mật khẩu phải có ít nhất 8 ký tự")
    .matches(/[A-Z]/).withMessage("Mật khẩu phải chứa ít nhất 1 chữ hoa")
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage("Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt")
]

export { loginValidator }
