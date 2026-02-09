import { Cart } from "../../../database/models/cart.model.js"
import { Order } from "../../../database/models/order.model.js"
import { Product } from "../../../database/models/product.mode.js"
import { User } from "../../../database/models/user.model.js"
import { catchError } from "../../middleware/catchError.js"
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);


const addWebhook = catchError(async (req, res ,next) => {
       const sig = req.headers['stripe-signature'].toString()
    const event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET)
    let checkout
    if (event.type == 'checkout.session.completed') {
        checkout = event.data.object
        let cart = await Cart.findById(checkout.client_reference_id)
        if (!cart) next(new AppError("cart not found", 404))
        let user = await User.findOne({ email: checkout.customer_email })

        let order = new Order({
            user: user._id,
            orderItems: cart.cartItems,
            totalOrderPrice: checkout.amount_total / 100,
            shippingAddress: checkout.metadata,
            paymentType: "card",
            isPaid: true,
            paidAt: Date.now()
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
    }
    res.status(200).json({ message: "success", checkout })
})





export {
    addWebhook
}
