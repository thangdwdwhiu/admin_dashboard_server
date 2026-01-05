import app from "./app.js"
import dotenv from 'dotenv'
import http from "http"

import { initSocket } from './src/socket/index.js'
dotenv.config()

const port = process.env.PORT || 3000
const server = http.createServer(app)
initSocket(server)
server.listen(port, () => {
    console.log("server running at port : ", port);
})
