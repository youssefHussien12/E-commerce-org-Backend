import slugify from "slugify"
import { Category } from "../../../database/models/category.model.js"
import { deleteOne, getAll, getOne, updateOne } from "../handlers/handlers.js"
import { catchError } from "../../middleware/catchError.js"


const addCategory = catchError(async (req, res) => {
    req.body.slug = slugify(req.body.name)
    req.body.image = req.file.filename
    let category = new Category(req.body)
    await category.save()
    res.status(201).json({ message: "category created successfully", category })
})



const getAllCategories = getAll(Category)
const getCategory = getOne(Category)
const updateCategory = updateOne(Category)
const deleteCategory = deleteOne(Category)




export {
    addCategory,
    getAllCategories,
    getCategory,
    updateCategory,
    deleteCategory
}