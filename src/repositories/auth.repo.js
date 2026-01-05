import db from "../config/db.js";

class authRepo {
  findUserByEmail = async (email) => {
    const sql = `select * from users where email = $1`;
    const f = await db.query(sql, [email]);
    if (f.rows.length > 0) return f.rows[0];
  };

  findUserByID = async (id) => {
    const sql = `select * from users where id = $1`;
    const f = await db.query(sql, [id]);
    if (f.rows.length > 0) return f.rows[0];
  };
 saveSession = async (id, refresh_token, ip_address, device) => {
 
  await db.query(
    `
    UPDATE user_devices
    SET is_revoked = true
    WHERE user_id = $1
      AND device_id = $2
      AND is_revoked = false
  `,
    [id, device.device_id]
  );

  // insert session mới
  const savedRes = await db.query(
    `
    INSERT INTO user_devices
    (user_id, refresh_token, device_id, device_name, ip_address, user_agent)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
    `,
    [
      id,
      refresh_token,
      device.device_id,
      device.device_name,
      ip_address,
      device.user_agent,
    ]
  );

  return savedRes.rows[0];
};
  isDeviceActive = async (userId, deviceId) => {
  const result = await db.query(
    `
    SELECT 1
    FROM user_devices
    WHERE user_id = $1
      AND device_id = $2
      AND is_revoked = false
    LIMIT 1
  `,
    [userId, deviceId]
  );

  return result.rows.length > 0;
}
 revokeDevice = async (userId, deviceId) => {
  await db.query(
    `
    UPDATE user_devices
    SET is_revoked = true
    WHERE user_id = $1
      AND device_id = $2
      AND is_revoked = false
  `,
    [userId, deviceId]
  );
};
// CHANGE PASSWORD
changePassword = async (user_id, password) => {
  const sql = `update users 
               set password = $1
               where id = $2
    `
              
  await db.query(sql, [password, user_id])
}
//Get password
  getPasswordByID = async (id) => {
    const sql = `select password from users where id = $1`;
    const f = await db.query(sql, [id]);
    return f.rows[0]
  };
}


export default new authRepo();
