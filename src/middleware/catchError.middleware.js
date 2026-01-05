const catchError = (app) => {
  app.use((err, req, res, next) => {
    const isCustom = Number.isInteger(err.status)

    const status = isCustom ? err.status : 500
    const error = isCustom ? err.message : "Lỗi server"

    if (!isCustom) {
      if (process.env.NODE_ENV !== "production") {
        console.error(err.stack)
      } else {
        console.error("Internal server error")
      }
    }
    
    res.status(status).json({
      success: false,
      error,
      code: err.code || null
    })
  })
}

export default catchError
