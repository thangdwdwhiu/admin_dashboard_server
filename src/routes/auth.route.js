import express from "express"
import authController from "../controllers/auth.controller.js"
import handleValidator from "../middleware/handleValidator.middleware.js"
import { loginValidator } from "../validator/auth.validator.js"
import authMiddleware from "../middleware/auth.middleware.js"

const authRoute = express.Router()

// DINH NGHIA ROUTES

authRoute.post("/login", loginValidator,handleValidator,authController.login)
authRoute.get("/me", authController.checkAuth)
authRoute.post("/refresh", authController.refresh)
authRoute.delete("/logout", authController.logout)
authRoute.put("/change-password", authMiddleware, authController.changePassword)
export default authRoute