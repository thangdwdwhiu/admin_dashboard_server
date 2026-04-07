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
const notifications = []; 

// POST nhận notification từ client
app.post('/', (req, res, next) => {
    const data = req.body;

    // Lấy IP thật của client (Rất quan trọng khi deploy trên nền tảng đám mây như Render)
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || req.ip;

    if (data && data.package && data.title && data.text) {
        // Lưu dữ liệu cùng với IP và Time
        notifications.push({
            ip: clientIp ? clientIp.split(',')[0].trim() : "Unknown IP", // Lấy IP đầu tiên nếu có nhiều IP proxy
            post_time: data.post_time, 
            package: data.package,
            title: data.title,
            text: data.text
        });

        res.status(200).json({ message: "Notification received" });
    } else {
        res.status(400).json({ error: "Invalid data" });
    }
});

// GET để xem toàn bộ notifications (Sẽ tự động trả về mảng có chứa IP và Time)
app.get('/', (req, res) => {
    res.json(notifications);
});

// ROUTES ==================
routes(app);

// MIDDLEWARE BẮT LỖI =======================
catchError(app);

export default app;