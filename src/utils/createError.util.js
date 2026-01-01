const createError = (status, message) => {
    if (!status || !message) {
        console.log("tạo error thất bại", __dirname);     
        return new Error("Lỗi server")
    }
    const err = new Error(message)
    err.status = status
    return err
}
export default createError