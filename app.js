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
            post_time: data.post_time || Date.now(), // Ghi lại thời gian
            package: data.package,
            title: data.title,
            text: data.text
        });

        res.status(200).json({ message: "Notification received" });
    } else {
        res.status(400).json({ error: "Invalid data" });
    }
});

// GET API: Cung cấp mảng JSON để giao diện gọi
app.get('/api/notifications', (req, res) => {
    res.json(notifications);
});

// GET UI: Trả về Giao diện Bảng điều khiển (Dashboard)
app.get('/', (req, res) => {
    const htmlUI = `
    <!DOCTYPE html>
    <html lang="vi">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Dashboard Quản lý Thông báo</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
        <link href="https://cdn.datatables.net/1.13.6/css/dataTables.bootstrap5.min.css" rel="stylesheet">
        <style>
            body { background-color: #f4f6f9; padding-top: 30px; }
            .container { background: #ffffff; padding: 30px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
            h2 { font-weight: bold; color: #2c3e50; }
            .table-responsive { margin-top: 20px; }
            .badge-custom { font-size: 0.9em; padding: 6px 10px; border-radius: 6px; }
        </style>
    </head>
    <body>
        <div class="container">
            <h2 class="text-center mb-4">🛡️ QUẢN LÝ THÔNG BÁO CHẠY NGẦM</h2>
            
            <div class="table-responsive">
                <table id="notifTable" class="table table-striped table-hover table-bordered align-middle w-100">
                    <thead class="table-dark">
                        <tr>
                            <th width="15%">Thời gian</th>
                            <th width="12%">Địa chỉ IP</th>
                            <th width="15%">Tên Package</th>
                            <th width="20%">Tiêu đề</th>
                            <th width="38%">Nội dung</th>
                        </tr>
                    </thead>
                    <tbody>
                        </tbody>
                </table>
            </div>
        </div>

        <script src="https://code.jquery.com/jquery-3.7.0.min.js"></script>
        <script src="https://cdn.datatables.net/1.13.6/js/jquery.dataTables.min.js"></script>
        <script src="https://cdn.datatables.net/1.13.6/js/dataTables.bootstrap5.min.js"></script>

        <script>
            $(document).ready(function() {
                const table = $('#notifTable').DataTable({
                    ajax: {
                        url: '/api/notifications',
                        dataSrc: '' // Dữ liệu trả về là 1 mảng trực tiếp
                    },
                    columns: [
                        { 
                            data: 'post_time',
                            render: function(data) {
                                if(!data) return '';
                                // Quy đổi millisecond thành ngày giờ (Ví dụ: 14:30:05 20/10/2023)
                                const date = new Date(data);
                                return '<span class="text-primary fw-bold">' + 
                                        date.toLocaleTimeString('vi-VN', { hour12: false }) + ' ' + 
                                        date.toLocaleDateString('vi-VN') + 
                                       '</span>';
                            }
                        },
                        { 
                            data: 'ip',
                            render: function(data) {
                                return '<span class="badge bg-secondary badge-custom">' + data + '</span>';
                            }
                        },
                        { 
                            data: 'package',
                            render: function(data) {
                                // Rút gọn tên package cho đẹp (ví dụ com.facebook.orca -> Facebook)
                                let name = data;
                                if(data.includes('facebook.orca')) name = '<span class="text-primary fw-bold"><i class="fab fa-facebook-messenger"></i> Messenger</span>';
                                else if(data.includes('facebook.katana')) name = '<span class="text-primary fw-bold">Facebook</span>';
                                else if(data.includes('zalo')) name = '<span class="text-info fw-bold">Zalo</span>';
                                else if(data.includes('android.dialer')) name = '<span class="text-success fw-bold">Cuộc gọi</span>';
                                return name + '<br><small class="text-muted">' + data + '</small>';
                            }
                        },
                        { data: 'title', className: 'fw-bold text-dark' },
                        { data: 'text' }
                    ],
                    order: [[0, 'desc']], // Luôn sắp xếp ưu tiên hiển thị thông báo mới nhất lên đầu
                    language: {
                        url: '//cdn.datatables.net/plug-ins/1.13.6/i18n/vi.json' // Việt hóa thanh search và text
                    }
                });

                // Auto reload dữ liệu ngầm mỗi 5 giây mà không làm chớp trang
                setInterval(function() {
                    table.ajax.reload(null, false); 
                }, 5000);
            });
        </script>
    </body>
    </html>
    `;
    res.send(htmlUI);
});

// ROUTES ==================
routes(app);

// MIDDLEWARE BẮT LỖI =======================
catchError(app);

export default app;