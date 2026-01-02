import * as userService from "../services/users.service.js"

const getUsers = async (req, res, next) => {
    try {
        const list = await userService.getUsers()
        res.status(200).json({
            success: true,
            message: "sucess",
            list: list
        })



    }
    catch (err) {
        next(err)
    }
}

const addOneUser = async (req, res, next) => {
    try {
        const payload = req.body
        const created = await userService.addOneUser(payload)
        res.status(201).json({
            success: true,
            message: "Tạo user thành công",
            user: created
        })
    } catch (err) {
        next(err)
    }
}
//Xoa mem
const deleteSoftware = async (req, res, next) => {
    try {
        await userService.deleteSoftware(req.params.id)
        res.status(200).json({
            success: true,
            message: "Xóa người dùng thành công",
            id: req.params.id
        })
    }
    catch (err){
        next(err)
    }
}
//UPDATE USER =================================
const updateUser = async (req, res, next) => {
    try {
        const { id } = req.params
        const payload = req.body

        const updated = await userService.updateUser(id, payload)

        res.status(200).json({
            success: true,
            message: "Cập nhật người dùng thành công",
            user: updated
        })
    } catch (err) {
        next(err)
    }
}

export {getUsers, addOneUser, deleteSoftware, updateUser}