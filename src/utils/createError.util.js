const createError = (status, message, code = "") => {
    if (!status || !message) {
        console.log("tạo error thất bại", __dirname);     
        return new Error("Lỗi server")
    }
    const err = new Error(message)
    err.status = status
    err.code = code
    return err
}
export default createError