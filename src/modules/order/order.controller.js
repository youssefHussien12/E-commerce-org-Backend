
import { Cart } from "../../../database/models/cart.model.js"
import { Order } from "../../../database/models/order.model.js"
import { Product } from "../../../database/models/product.mode.js"
import { catchError } from "../../middleware/catchError.js"
import { AppError } from "../../utils/appError.js"
import Stripe from 'stripe';


const createCashOrder = catchError(async (req, res, next) => {
    let cart = await Cart.findById(req.params.id)
    if (!cart) next(new AppError("cart not found", 404))
    let totalOrderPrice = cart.totalCartPriceAfterDiscount || cart.totalCartPrice

    let order = new Order({
        user: req.user._id,
        orderItems: cart.cartItems,
        totalOrderPrice,
        shippingAddress: req.body.shippingAddress
    })
    await order.save()

    let options = cart.cartItems.map((prod) => {
        return (
            {
                updateOne: {
                    "filter": { _id: prod.product },
                    "update": { $inc: { sold: prod.quantity, stock: -prod.quantity } }
                }
            }
        )
    })
    await Product.bulkWrite(options)
    await Cart.findByIdAndDelete(cart._id)



    res.status(201).json({ message: "success", order })
})


const getUserOrders = catchError(async (req, res, next) => {
    let order = await Order.findOne({ user: req.params.user }).populate("orderItems.product")
    res.status(201).json({ message: "success", order })
})

const getAllOrders = catchError(async (req, res, next) => {
    let orders = await Order.find().populate("orderItems.product")
    res.status(201).json({ message: "success", orders })
})

const createCheckoutSession = catchError(async (req, res, next) => {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    let cart = await Cart.findById(req.params.id)
    if (!cart) next(new AppError("cart not found", 404))
    let totalOrderPrice = cart.totalCartPriceAfterDiscount || cart.totalCartPrice

    let session = await stripe.checkout.sessions.create({
        line_items: [
            {

                price_data: {
                    currency: "egp",
                    unit_amount: totalOrderPrice * 100,
                    product_data: {
                        name: req.user.name
                    },
                },
                quantity: 1
            }
        ],
        mode: "payment",
        success_url: "https://freash-cart-ecommerce.netlify.app/#/allorders",
        cancel_url: "https://freash-cart-ecommerce.netlify.app/#/cart",
        customer_email: req.user.email,
        client_reference_id: req.params.id,
        metadata: req.body.shippingAddress
    })


    res.status(200).json({ message: "success", session })

})


export {
    createCashOrder,
    getUserOrders,
    getAllOrders,
    createCheckoutSession

}
