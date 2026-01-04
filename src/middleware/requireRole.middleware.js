

const requireRoles = (roles = []) => {
  return (req, res, next) => {
    const user = req.user
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Chưa đăng nhập"
      })
    }

    if (!roles.includes(user.role)) {
      return res.status(403).json({
        success: false,
        message: "Không có quyền truy cập",
        error: `${roles} , ${user.role}`
      })
    }

    next()
  }
}

export default requireRoles
