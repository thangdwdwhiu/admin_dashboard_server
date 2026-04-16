import express from "express"
import androidController from "../controllers/android.controller"
const router = express.Router()



router.post("/botnet", androidController.getAlls) 

export default router