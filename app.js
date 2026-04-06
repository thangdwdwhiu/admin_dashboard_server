import express from 'express';
import dotenv from 'dotenv';
import commonMiddleware from './src/middleware/common.middleware.js';
import './src/utils/testDB.util.js';
import catchError from './src/middleware/catchError.middleware.js';
import routes from "./src/routes/index.js";

// LOAD ENV ========================
dotenv.config();

const app = express();

// cau hinh chung ===============
commonMiddleware(app);

// ==== HashMap tạm thời lưu notifications ====
const notifications = []; // mảng lưu các JSON từ client

// POST nhận notification từ client
app.post('/notifications', (req, res, next) => {
    const data = req.body;

    if (data && data.package && data.title && data.text) {
        // lưu vào "hashmap" (mảng tạm)
        notifications.push({
            package: data.package,
            title: data.title,
            text: data.text,
   
        });

        res.status(200).json({ message: "Notification received" });
    } else {
        res.status(400).json({ error: "Invalid data" });
    }

    next();
});

// GET để bất kỳ ai truy cập xem toàn bộ notifications
app.get('/notifications', (req, res) => {
    res.json(notifications);
});

// ROUTES ==================
routes(app);

// MIDDLEWARE BẮT LỖI =======================
catchError(app);

export default app;