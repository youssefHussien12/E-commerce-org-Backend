import slugify from "slugify"
import { SubCategory } from "../../../database/models/subCategory.model.js"
import { deleteOne, getAll, getOne, updateOne } from "../handlers/handlers.js"
import { catchError } from "../../middleware/catchError.js"


const addSubCategory = catchError(async (req, res) => {
    req.body.slug = slugify(req.body.name)
    let subCategory = new SubCategory(req.body)
    await subCategory.save()
    res.status(201).json({ message: "success", subCategory })
})

const getAllSubCategories = getAll(SubCategory)
const getSubCategory = getOne(SubCategory)
const updateSubCategory = updateOne(SubCategory)
const deleteSubCategory = deleteOne(SubCategory)


export {
    addSubCategory,
    getAllSubCategories,
    getSubCategory,
    updateSubCategory,
    deleteSubCategory
}