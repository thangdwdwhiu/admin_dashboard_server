import express from "express"
import * as authController from "../controllers/auth.controller.js"
import handleValidator from "../middleware/handleValidator.middleware.js"
import { loginValidator } from "../validator/auth.validator.js"

const authRoute = express.Router()

// DINH NGHIA ROUTES

authRoute.post("/login", loginValidator,handleValidator,authController.login)
authRoute.get("/me", authController.checkAuth)
authRoute.post("/refresh", authController.refresh)
authRoute.delete("/logout", authController.logout)
export default authRoute