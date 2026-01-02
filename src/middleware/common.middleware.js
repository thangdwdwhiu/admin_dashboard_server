import cors from 'cors'
import cookieParser from 'cookie-parser'
import express from 'express'
import dotenv from 'dotenv'

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
const commonMiddleware = (app) => {
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(cookieParser());
  app.use(cors(configCors));
};
export default commonMiddleware
