import express from "express"
import authMiddleware from "../middleware/auth.middleware.js"
import requireRoles from "../middleware/requireRole.middleware.js"
import * as reportController from "../controllers/report.controller.js"

const reportRoute = express.Router()

reportRoute.get("/stats", authMiddleware, requireRoles([1,2]), reportController.getDashboardStats)

export default reportRoute