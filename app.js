
import express from 'express'
import dotenv from 'dotenv'
import commonMiddleware from './src/middleware/common.middleware.js'
import './src/utils/testDB.util.js'
import catchError from './src/middleware/catchError.middleware.js'
import routes from "./src/routes/index.js"


// LOAD ENV ========================
dotenv.config()

const app = express()

// cau hinh chung ===============
commonMiddleware(app)

//test ============================
app.get('/', (req, res, next) => {
    next()
})

// ROUTES ==================
routes(app)

// MIDDLEWARE BẮT LỖI =======================
catchError(app)
export default app
