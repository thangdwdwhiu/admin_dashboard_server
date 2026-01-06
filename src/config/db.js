import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

// Nếu production, dùng DATABASE_URL từ Render, còn dev thì dùng từng biến riêng
const db = new Pool(
  process.env.NODE_ENV === "production"
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }, // cần cho kết nối cloud
      }
    : {
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        port: process.env.DB_PORT || 5432,
      }
);

export default db;
