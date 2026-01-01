import { Pool } from "pg"
import dotenv from 'dotenv'

dotenv.config()

const db_host = process.env.DB_HOST
const db_name = process.env.DB_NAME
const db_user = process.env.DB_USER
const db_pass = process.env.DB_PASS
const port = process.env.DB_PORT || 5432
const db = new Pool({
    host: db_host,
    database: db_name,
    user: db_user,
    password: db_pass,
    port : port
})

export default db
