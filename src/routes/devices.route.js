import express from "express"
import authMiddleware from "../middleware/auth.middleware.js"
import devicesController from "../controllers/devices.controller.js"


const devicesRoute = express.Router()

devicesRoute.get("/", authMiddleware, devicesController.getAllDevicesActive)
devicesRoute.patch("/revoke/:id", authMiddleware, devicesController.revokeOneDevice)
devicesRoute.put("/revoke-other/:id", authMiddleware, devicesController.revokeAllDeviceWithoutMe)
export default devicesRoute