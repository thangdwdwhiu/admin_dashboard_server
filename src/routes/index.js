import authRoute from "./auth.route.js"
import reportRoute from "./report.route.js"

export default (app)=>{
    app.use("/api/auth", authRoute)
    app.use("/api/report", reportRoute)
}