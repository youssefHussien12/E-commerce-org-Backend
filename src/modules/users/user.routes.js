import { Router } from "express";
import { addUser, deleteUser, getAllUsers, getUser, updateUser } from "./user.controller.js";
import { checkEmail } from "../../middleware/checkEmail.js";
import orderRouter from "../order/order.routes.js";
import { allowedTo, protectedRoutes } from "../auth/auth.controller.js";



const userRouter = Router()
userRouter.use('/:user/orders', orderRouter)
userRouter
    .route('/')
    .post(checkEmail, addUser)
    .get(getAllUsers)
userRouter
    .route('/:id')
    .get(getUser)
    .put(protectedRoutes,allowedTo('admin'),checkEmail, updateUser)
    .delete(protectedRoutes,allowedTo('admin'),deleteUser)



export default userRouter