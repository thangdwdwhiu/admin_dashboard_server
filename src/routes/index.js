import authRoute from "./auth.route.js"
import reportRoute from "./report.route.js"
import usersRoute from "./users.route.js"

export default (app)=>{
    app.use("/api/auth", authRoute)
    app.use("/api/report", reportRoute)
    app.use("/api/users", usersRoute)
}