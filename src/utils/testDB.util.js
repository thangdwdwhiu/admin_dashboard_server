import db from "../config/db.js";
async function testConnection() {
  try {
    const result = await db.query("SELECT NOW()")
    console.log("=> Kết nối đến database thành công!")
    console.log("Server time:", result.rows[0].now)
  } catch (err) {
    console.log(err);
    
    console.error("❌ Kết nối thất bại:", err.message)
  } finally {
 
  }
}

testConnection()

