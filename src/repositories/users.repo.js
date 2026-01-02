import db from "../config/db.js"

const getUsers = async () => {
  const res = await db.query(`
    SELECT 
      u.id,
      u.full_name,
      u.email,
      u.status,
      r.name AS role_name
    FROM users u
    JOIN roles r ON u.role_id = r.id
    WHERE u.is_deleted = $1
  `, [false])

  return res.rows
}

const addOneUser = async (payload) => {
  const { full_name, email, password, role_id } = payload

  const sql = `
    INSERT INTO users (full_name, email, password, role_id)
    VALUES ($1, $2, $3, $4)
    RETURNING id, full_name, email, status, role_id
  `

  const values = [full_name, email, password, role_id]
  const res = await db.query(sql, values)
  return res.rows[0]
}

// XOA MEM
const deleteSoftware = async (id) => {
  const res = await db.query(
    `UPDATE users SET is_deleted = $1 WHERE id = $2`,
    [true, id]
  )
  return res.rowCount > 0
}

// UPDATE USER
const updateUser = async (id, data) => {
  const keys = Object.keys(data)
  if (keys.length === 0) return null

  const fields = []
  const values = []

  keys.forEach((key, index) => {
    fields.push(`${key} = $${index + 1}`)
    values.push(data[key])
  })

  values.push(id)

  const updateQuery = `
    UPDATE users
    SET ${fields.join(", ")}
    WHERE id = $${values.length}
    RETURNING id
  `

  const updateRes = await db.query(updateQuery, values)
  if (updateRes.rowCount === 0) return null

  const selectQuery = `
    SELECT 
      u.id,
      u.full_name,
      u.email,
      u.status,
      r.name AS role_name
    FROM users u
    JOIN roles r ON u.role_id = r.id
    WHERE u.id = $1
  `

  const result = await db.query(selectQuery, [id])
  return result.rows[0]
}

export { getUsers, addOneUser, deleteSoftware, updateUser }

const findRoleByName = async (name) => {
  const res = await db.query(
    `SELECT id, name FROM roles WHERE name = $1`,
    [name]
  )
  return res.rows[0]
}

export { findRoleByName }
