import { Router } from "express";
import { allowedTo, protectedRoutes } from "../auth/auth.controller.js";
import { addToCart, applyCoupon, clearCart, getLoggedUserCart, removeItemFromCart, updateQuantity } from "./cart.controller.js";




const cartRouter = Router()
cartRouter.use(protectedRoutes, allowedTo("user"))
cartRouter
    .route('/')
    .post(addToCart)
    .get(getLoggedUserCart)
    .delete(clearCart)
cartRouter
    .route('/:id')
    .put(updateQuantity)
    .delete(removeItemFromCart)
cartRouter
    .post("/apply-coupon", applyCoupon)






export default cartRouter