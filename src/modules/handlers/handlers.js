import fs from "fs"
import path from "path"
import slugify from "slugify"
import { ApiFeatures } from "../../utils/apiFeatures.js"
import { AppError } from "../../utils/appError.js"
import { catchError } from "../../middleware/catchError.js"




const getAll = (model) => {
    return catchError(async (req, res, next) => {
        let filterObj = {}
        if (req.params.category) filterObj.category = req.params.category
        let apiFeatures = new ApiFeatures(model.find(filterObj), req.query)
            .filter().sort().fields().search()
        await apiFeatures.pagination(model);
        let data = await apiFeatures.mongooseQuery
        let result = apiFeatures.total
        let metadata = { currentPage: apiFeatures.pageNumber, limit: apiFeatures.limit, totalPages: apiFeatures.totalPages, ...(apiFeatures.nextPage ? { nextPage: apiFeatures.nextPage } : apiFeatures.prevPage ? { prevPage: apiFeatures.prevPage } : {}) };
        res.status(200).json({ result, metadata, data })
    })
}

const getOne = (model) => {
    return catchError(async (req, res, next) => {
        let document = await model.findById(req.params.id)
        document || next(new AppError("document not found", 404))
        !document || res.status(200).json({ message: "success", document })
    })
}



const getFileNameOnly = value => value.split("/").pop();
const deleteFile = (destination, storedValue) => {
    if (!destination || !storedValue) return;
    const fileName = getFileNameOnly(storedValue);
    const absolutePath = path.resolve(destination, fileName);
    fs.existsSync(absolutePath) ? fs.unlinkSync(absolutePath) : {}
};

const updateOne = (model) => {
    return catchError(async (req, res, next) => {
        const oldDoc = await model.findById(req.params.id);
        if (!oldDoc) return next(new AppError("document not found", 404));

        let slugScore = req.body.title || req.body.name;
        if (slugScore) req.body.slug = slugify(slugScore)

        if (req.file?.fieldname === 'logo') {
            deleteFile(req.file.destination, oldDoc.logo)
            req.body.logo = req.file.filename
        }
        if (req.file?.fieldname === 'image') {
            deleteFile(req.file.destination, oldDoc.image)
            req.body.image = req.file.filename
        }
        if (req.files?.imageCover?.length) {
            deleteFile(req.files.imageCover[0].destination, oldDoc.imageCover)
            req.body.imageCover = req.files.imageCover[0].filename;
        }
        if (req.files?.images?.length) {
            oldDoc.images?.length ? oldDoc.images.forEach(img => deleteFile(req.files.images[0].destination, img)) : {}
            req.body.images = req.files.images.map(img => img.filename);
        }
        let document = await model.findByIdAndUpdate(req.params.id, req.body, { new: true })
        document || next(new AppError("document not found", 404))
        !document || res.status(200).json({ message: "success", document })
    })
}

const deleteOne = (model) => {
    return catchError(async (req, res, next) => {
        let document = await model.findByIdAndDelete(req.params.id)
        document || next(new AppError("document not found", 404))
        !document || res.status(200).json({ message: "success", document })
    })
}



export {
    deleteOne,
    getOne,
    getAll,
    updateOne
}
