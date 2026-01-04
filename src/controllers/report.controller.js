import reportRepo from "../repositories/report.repo.js"

class reportController{

    getDashboardStats = async(req, res, next) =>{
    try {
        const [totalRes, statusRes, roleRes] = await reportRepo.getDashboardStats()
        // XU LY DU LIEU THO ======================================
        const totalUsers = parseInt(totalRes.rows[0].count)
        const statusMap = statusRes.rows.reduce((acc, curr) => {
            acc[curr.status] = parseInt(curr.count);
            return acc;
            }, {});
        // FOMAT BIEU DO TRON ====================================
        const roleChartData = roleRes.rows.map(row => ({
            name: row.name,
            value: parseInt(row.count)
            }))

        return res.status(200).json({
            success: true,
            data: {
                summary: {
                total: totalUsers,
                active: statusMap['ACTIVE'] || 0,
                blocked: statusMap['BLOCKED'] || 0
                },
                chart: roleChartData
            }
            });
            }
    catch (err) {
        next(err)
    }
}
}
export default new reportController