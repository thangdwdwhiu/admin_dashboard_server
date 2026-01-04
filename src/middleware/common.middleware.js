import cors from 'cors'
import cookieParser from 'cookie-parser'
import express from 'express'
import dotenv from 'dotenv'
import {fileURLToPath} from "url"
import path from 'path'


dotenv.config()
const port = process.env.PORT || 3000
const urlClient = process.env.URL_CLIENT || "http://localhost:5173"
const configCors = {
  origin: urlClient,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE","PATCH","OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  port: port
}
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const commonMiddleware = (app) => {
  app.use(express.static(path.join(__dirname, "../../public")))
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(cookieParser());
  app.use(cors(configCors));
  
};
export default commonMiddleware
