import multer from "multer"
import path from "path"
import {fileURLToPath} from "url"


const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../../public/images/upload"))
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname)
        const filename = `avatar-${Date.now()}${ext}`
        cb(null, filename)
    }
})

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true)
  } else {
    cb(new Error("Chỉ được upload ảnh"), false)
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024, 
  },
})


export default upload

