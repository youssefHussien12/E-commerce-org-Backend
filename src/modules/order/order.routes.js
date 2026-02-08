import { Router } from "express";
import { allowedTo, protectedRoutes } from "../auth/auth.controller.js";
import { createCashOrder, createCheckoutSession, getAllOrders, getUserOrders } from "./order.controller.js";


const orderRouter = Router({ mergeParams: true })

orderRouter
    .route('/:id')
    .post(protectedRoutes, allowedTo("user"), createCashOrder)
orderRouter
    .route('/')
    .get(protectedRoutes, allowedTo("user"), getUserOrders)
orderRouter
    .route('/all')
    .get(protectedRoutes, allowedTo("admin"), getAllOrders)
orderRouter
    .post("/checkout/:id",protectedRoutes, allowedTo("user"), createCheckoutSession)






export default orderRouter