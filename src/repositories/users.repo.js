// src/repositories/users.repo.js
import db from "../config/db.js"

class UserRepository {

  async getUsers() {
    const res = await db.query(
      `
      SELECT 
        u.id,
        u.full_name,
        u.email,
        u.status,
        r.name AS role_name
      FROM users u
      JOIN roles r ON u.role_id = r.id
      WHERE u.is_deleted = false
      `
    )
    return res.rows
  }

  async addOneUser(payload) {
    const { full_name, email, password, role_id } = payload

    const res = await db.query(
      `
      INSERT INTO users (full_name, email, password, role_id)
      VALUES ($1, $2, $3, $4)
      RETURNING id, full_name, email, status, role_id
      `,
      [full_name, email, password, role_id]
    )

    return res.rows[0]
  }

  // soft delete
  async deleteSoftware(id) {
    const res = await db.query(
      `UPDATE users SET is_deleted = true WHERE id = $1`,
      [id]
    )
    return res.rowCount > 0
  }

  async updateUser(id, data) {
    const keys = Object.keys(data)
    if (keys.length === 0) return null

    const fields = []
    const values = []

    keys.forEach((key, index) => {
      fields.push(`${key} = $${index + 1}`)
      values.push(data[key])
    })

    values.push(id)

    const updateRes = await db.query(
      `
      UPDATE users
      SET ${fields.join(", ")}
      WHERE id = $${values.length}
      RETURNING id
      `,
      values
    )

    if (updateRes.rowCount === 0) return null

    return this.getById(id)
  }

  async getById(id) {
    const res = await db.query(
      `
      SELECT 
        u.id,
        u.full_name,
        u.email,
        u.status,
        r.name AS role_name
      FROM users u
      JOIN roles r ON u.role_id = r.id
      WHERE u.id = $1
      `,
      [id]
    )
    return res.rows[0]
  }

  async getRoleByID(id) {
    const res = await db.query(
      `SELECT role_id FROM users WHERE id = $1`,
      [id]
    )
    return res.rows[0]?.role_id ?? null
  }

  async findRoleByName(name) {
    const res = await db.query(
      `SELECT id, name FROM roles WHERE name = $1`,
      [name]
    )
    return res.rows[0]
  }

  async getProfile(id) {
    const res = await db.query(
      `
      SELECT 
        u.id,
        u.email,
        u.full_name,
        u.status,
        u.avatar,
        u.is_deleted,
        u.created_at,
        u.updated_at,
        r.name AS role_name,
        r.description
      FROM users u
      JOIN roles r ON u.role_id = r.id
      WHERE u.id = $1
      `,
      [id]
    )
    return res.rows[0]
  }

  async updateProfile(fields, id) {
    const res = await db.query(
      `
      UPDATE users
      SET
        avatar    = COALESCE(NULLIF($1, ''), avatar),
        full_name = COALESCE(NULLIF($2, ''), full_name)
      WHERE id = $3
      RETURNING id, email, full_name, avatar
      `,
      [fields.avatar ?? null, fields.full_name ?? null, id]
    )
    return res.rows[0]
  }
}

export default new UserRepository()
