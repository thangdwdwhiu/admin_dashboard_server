import devicesRepo from "../repositories/devices.repo.js"

class devicesService {
    
    //GET DEVICES đang đăng nhập
    getAllDevicesActiveByUserID = async (id) => {
        const devicesRes = await devicesRepo.getAllDevicesActiveByUserID(id)
        return devicesRes
    }
    // Đăng xuất ra 1 thiết bị
    revokeOneDevice = async (user_id,device_id) => {
        const revoked = await devicesRepo.revokeOneDevice(user_id, device_id)
        return revoked
    } 
    revokeAllDeviceWithoutMe = async (user_id, device_id) => {
        await devicesRepo.revokeAllDeviceWithoutMe(user_id, device_id)
    }
} 

export default new devicesService