import slugify from "slugify"
import { Brand } from "../../../database/models/brand.model.js"
import { deleteOne, getAll, getOne, updateOne } from "../handlers/handlers.js"
import { catchError } from "../../middleware/catchError.js"


const addBrand = catchError(async (req, res) => {
    req.body.slug = slugify(req.body.name)
    req.body.logo = req.file.filename
    let brand = new Brand(req.body)
    await brand.save()
    res.status(201).json({ message: "success", brand })
})

const getAllBrands = getAll(Brand)

const getBrand = getOne(Brand)
const updateBrand = updateOne(Brand)
const deleteBrand = deleteOne(Brand)




export {
    addBrand,
    getAllBrands,
    getBrand,
    updateBrand,
    deleteBrand
}