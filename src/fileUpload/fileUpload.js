
import multer from "multer"
import { v4 as uuidv4 } from 'uuid';
import { AppError } from "../utils/appError.js";



const UploadFile = (folderName) => {
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, `uploads/${folderName}`)
        },
        filename: (req, file, cb) => {
            cb(null, uuidv4() + "-" + file.originalname)
        }
    })

    function fileFilter(req, file, cb) {
        if (file.mimetype.startsWith("image")) {
            cb(null, true)
        } else {
            cb(new AppError("file must be an image", 401), false)
        }
    }

    const upload = multer({
        storage, fileFilter, limits: {
            fileSize: 1 * 1024 * 1024
        }
    })
    return upload

}


export const uploadSingleFile = (fieldName,folderName) => UploadFile(folderName).single(fieldName) 
export const uploadMixOfFiles = (arrayOfFields,folderName) => UploadFile(folderName).fields(arrayOfFields) 