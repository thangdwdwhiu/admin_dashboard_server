import db from "../config/db.js";

class authRepo {
    findUserByEmail = async (email) => {
    const sql = `select * from users where email = $1`
    const f = await db.query(sql, [email])
    if (f.rows.length > 0)
        return f.rows[0]
}

    findUserByID = async (id) => {
    const sql = `select * from users where id = $1`
    const f = await db.query(sql, [id])
    if (f.rows.length > 0)
        return f.rows[0]
}
}

export default new authRepo