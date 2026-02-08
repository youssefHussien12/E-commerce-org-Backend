import { Router } from "express";
import { addCategory, deleteCategory, getAllCategories, getCategory, updateCategory } from "./category.controller.js";
import { uploadSingleFile } from "../../fileUpload/fileUpload.js";
import { validation } from "../../middleware/validation.js";
import { addCategoryValidation, updateCategoryValidation } from "./category.validate.js";
import subCategoryRouter from "../subcategory/subcategory.routes.js";
import { allowedTo, protectedRoutes } from "../auth/auth.controller.js";



const categoryRouter = Router()

categoryRouter.use('/:category/subcategories', subCategoryRouter)

categoryRouter
    .route('/')
    .post(protectedRoutes, allowedTo("admin"), uploadSingleFile('image', 'categories'), validation(addCategoryValidation), addCategory)
    .get(getAllCategories)
categoryRouter
    .route('/:id')
    .get(getCategory)
    .put(protectedRoutes, allowedTo("admin"), uploadSingleFile('image', 'categories'), validation(updateCategoryValidation), updateCategory)
    .delete(protectedRoutes, allowedTo("admin"), deleteCategory)






export default categoryRouter