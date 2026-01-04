import express from "express"
import userController from "../controllers/users.controller.js"
import authMiddleware from "../middleware/auth.middleware.js"
import requireRole from "../middleware/requireRole.middleware.js"
import handleValidator from "../middleware/handleValidator.middleware.js"
import { registerValidator } from "../validator/auth.validator.js"

const userRoute = express.Router()

userRoute.get("/", authMiddleware, requireRole([1,2]), userController.getUsers)
userRoute.post("/", authMiddleware, requireRole([1]), registerValidator, handleValidator, userController.addOneUser)
userRoute.delete("/:id", authMiddleware, requireRole([1]), userController.deleteSoftware)
userRoute.patch("/:id", authMiddleware, requireRole([1]), userController.updateUser)
userRoute.get("/profile", authMiddleware, userController.getProfile)
export default userRoute