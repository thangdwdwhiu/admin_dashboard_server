import db from "../config/db.js"
class repositories {
   getDashboardStats = async () =>{
    const stats = await Promise.all([
        db.query("SELECT COUNT(*) as count FROM users WHERE is_deleted = false"),
        db.query("SELECT status, COUNT(*) as count FROM users WHERE is_deleted = false GROUP BY status"),
        db.query("SELECT r.name, COUNT(u.id) as count FROM users u JOIN roles r ON u.role_id = r.id WHERE u.is_deleted = false GROUP BY r.name")
        ]);
    return stats
    
    
}
}

export default new repositories