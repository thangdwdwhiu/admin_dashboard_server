import db from "../config/db.js";

class devicesRepo {
    //Lấy danh sách thiết bị
    getAllDevicesActiveByUserID = async (id) => {
    const allDevicesRes = await db.query(`
        SELECT
        id,
        device_id,
        device_name,
        ip_address,
        user_agent,
        last_used_at,
        created_at
        FROM public.user_devices
        WHERE user_id = $1
        AND is_revoked = false
        ORDER BY last_used_at DESC; 
            `, [id]);
        return allDevicesRes.rows
  };
    // Lấy tất cả kể cả đã đăng xuất
    getAllDevicesByUserID = async () => {
    const allDevicesRes = await db.query(`
        SELECT
        id,
        device_id,
        device_name,
        ip_address,
        user_agent,
        last_used_at,
        created_at
        FROM public.user_devices
        WHERE user_id = $1
        ORDER BY last_used_at DESC; 
            `);
  };
    //Logout 1 thiết bị POST /auth/logout-device/:device_id
    revokeOneDevice = async (user_id, device_id) => {
        const updatedRes = await db.query(`
            UPDATE public.user_devices
            SET is_revoked = true,
            last_used_at = NOW()
            WHERE user_id = $1
            AND device_id = $2
            AND is_revoked = false
            RETURNING *
            `, [user_id, device_id])
        return updatedRes.rows[0]

    }
    //Logout toàn bộ
    revokeAllDevice = async () => {
        const sql = `UPDATE public.user_devices
                     SET is_revoked = true,
                        last_used_at = NOW()
                        WHERE user_id = $1
                        AND is_revoked = false;
`
    }
    revokeAllDeviceWithoutMe = async (user_id, device_id) => {
        const sql = `UPDATE public.user_devices
                        SET is_revoked = true,
                        last_used_at = NOW()
                        WHERE user_id = $1
                        AND device_id <> $2
                        AND is_revoked = false
                        RETURNING *
`
await db.query(sql, [user_id, device_id])


    }


}

export default new devicesRepo