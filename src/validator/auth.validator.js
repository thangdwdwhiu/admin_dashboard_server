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

const registerValidator = [
  body("full_name")
    .trim()
    .notEmpty().withMessage("Họ và tên không được để trống")
    .isLength({ min: 3 }).withMessage("Họ và tên phải có ít nhất 3 ký tự"),

  body("email")
    .trim()
    .notEmpty().withMessage("Email không được để trống")
    .isEmail().withMessage("Email không đúng định dạng")
    .normalizeEmail(),

  body("password")
    .notEmpty().withMessage("Mật khẩu không được để trống")
    .isLength({ min: 8 }).withMessage("Mật khẩu phải có ít nhất 8 ký tự")
    .matches(/[A-Z]/).withMessage("Mật khẩu phải chứa ít nhất 1 chữ hoa")
    .matches(/[!@#$%^&*(),.?\":{}|<>]/).withMessage("Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt"),

  body("role_id")
    .notEmpty().withMessage("role_id không được để trống")
    .isInt({ min: 1, max: 3 }).withMessage("role_id phải là số từ 1 đến 3")
    .toInt()
]
export { loginValidator, registerValidator }
