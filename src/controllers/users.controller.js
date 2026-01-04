import userService from "../services/users.service.js";
import createError from "../utils/createError.util.js";

class UserController {
  /* ================= GET USERS ================= */
  async getUsers(req, res, next) {
    try {
      const list = await userService.getUsers();
      res.status(200).json({
        success: true,
        message: "success",
        list,
      });
    } catch (err) {
      next(err);
    }
  }

  /* ================= ADD USER ================= */
  async addOneUser(req, res, next) {
    try {
      const payload = req.body;
      const created = await userService.addOneUser(payload);

      res.status(201).json({
        success: true,
        message: "Tạo user thành công",
        user: created,
      });
    } catch (err) {
      next(err);
    }
  }

  /* ================= DELETE USER (SOFT) ================= */
  async deleteSoftware(req, res, next) {
    try {
      const { id } = req.params;

      await userService.deleteSoftware(id);

      res.status(200).json({
        success: true,
        message: "Xóa người dùng thành công",
        id,
      });
    } catch (err) {
      next(err);
    }
  }

  /* ================= UPDATE USER ================= */
  async updateUser(req, res, next) {
    try {
      const { id } = req.params;
      const payload = req.body;

      const updated = await userService.updateUser(id, payload);

      res.status(200).json({
        success: true,
        message: "Cập nhật người dùng thành công",
        user: updated,
      });
    } catch (err) {
      next(err);
    }
  }

  /* ================= GET PROFILE ================= */
  async getProfile(req, res, next) {
    try {
      const id = req.user?.id;
      if (!id) {
        throw createError(401, "Chưa đăng nhập");
      }

      const profile = await userService.getProfile(id);

      res.status(200).json({
        success: true,
        message: "Lấy profile thành công",
        profile,
      });
    } catch (err) {
      next(err);
    }
  }
  // UPDATE PROFILE
 async updateProfile(req, res, next) {
  try {
    const id = req.user?.id
    const { full_name } = req.body
    const fields = {}

    if (req.file) {
      fields.avatar = `/images/upload/${req.file.filename}`
    }

    if (full_name) {
      fields.full_name = full_name
    }
    if (Object.keys(fields) === 0)
       throw createError(400, "Chưa có thay đổi nào")
    const newProfile = await userService.updateProfile(fields, id)

    res.status(200).json({
      success: true,
      message: "Cập nhật profile thành công",
      profile: newProfile
    })
  } catch (err) {
    next(err)
  }
}

}

export default new UserController();
