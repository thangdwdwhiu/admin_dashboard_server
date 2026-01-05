import devicesService from "../services/devices.service.js";
import { getIO } from "../socket/index.js";
import createError from "../utils/createError.util.js";

class devicesController {
  async getAllDevicesActive(req, res, next) {
    try {
      const { id } = req.user;
      if (!id) {
        throw createError(403, "chưa đăng nhập");
      }
      const devicesRes = await devicesService.getAllDevicesActiveByUserID(id);
      res.status(200).json({
        success: true,
        message: "lấy thành công danh sách thiết bị",
        devices: devicesRes,
      });
    } catch (err) {
      next(err);
    }
  }
  async revokeOneDevice(req, res, next) {
    try {
      const io = getIO()
      const device_id = req.params.id;
      const { id: user_id } = req.user;
      if (!device_id) {
        throw createError(409, "không tìm thấy id thiết bị");
      }
      const revoked = await devicesService.revokeOneDevice(user_id, device_id)
      io.to(`device:${device_id}`).emit("revoke")
      res.status(200).json({
        success: true,
        message: `đã đăng xuất thiết bị ${revoked.device_name}`,
        device_id: device_id,
      });
    } catch (err) {
      next(err);
    }
  }
  async revokeAllDeviceWithoutMe(req, res, next) {
    try {
      const io = getIO();
      const { id: user_id } = req.user;
      const device_id = req.params.id;
      if (!device_id) {
        throw createError(409, "thiếu id thiết bị");
      }
      await devicesService.revokeAllDeviceWithoutMe(user_id, device_id);
      const userSockets = io.sockets.adapter.rooms.get(`user:${user_id}`);
      if (userSockets) {
        for (const socketId of userSockets) {
          const socketObj = io.sockets.sockets.get(socketId);
          if (socketObj && socketObj.user.device_id !== device_id) {
            socketObj.emit("revoke");
          }
        }
      }
      res.status(200).json({
        success: true,
        message: "Đã đăng xuất khỏi các thiết bị khác",
        device_id: device_id,
      });
    } catch (err) {
      next(err);
    }
  }
}

export default new devicesController();
