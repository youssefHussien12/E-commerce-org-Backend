
import { Cart } from "../../../database/models/cart.model.js"
import { Coupon } from "../../../database/models/coupon.model.js"
import { Product } from "../../../database/models/product.mode.js"
import { catchError } from "../../middleware/catchError.js"
import { AppError } from "../../utils/appError.js"

function calcTotalPrice(isCartExist) {
    isCartExist.totalCartPrice =
        isCartExist.cartItems.reduce((prev, curr) => prev += curr.quantity * curr.price, 0)

    if (isCartExist.discount) {
        isCartExist.totalCartPriceAfterDiscount =
            isCartExist.totalCartPrice - (isCartExist.totalCartPrice * isCartExist.discount) / 100
    }
}




const addToCart = catchError(async (req, res, next) => {
    let IsCartExist = await Cart.findOne({ user: req.user._id })

    let product = await Product.findById(req.body.product)
    if (!product) return res.status(404).json({ message: "product not found" })
    req.body.price = product.price

    if (req.body.quantity > product.stock) return next(new AppError("Sold Out", 409))

    if (!IsCartExist) {
        let cart = new Cart({
            user: req.user._id,
            cartItems: [req.body]
        })
        calcTotalPrice(cart)
        await cart.save()
        res.status(201).json({ message: "success", cart })
    } else {
        let item = IsCartExist.cartItems.find(item => item.product == req.body.product)
        if (item) {
            item.quantity += req.body.quantity || 1
            if (item.quantity > product.stock) return next(new AppError("Sold Out", 409))
        }
        !item ? IsCartExist.cartItems.push(req.body) : {}
        calcTotalPrice(IsCartExist)
        await IsCartExist.save()
        return res.status(200).json({ message: "success", cart: IsCartExist })
    }
})

const updateQuantity = catchError(async (req, res, next) => {
    let cart = await Cart.findOne({ user: req.user._id })
    let item = cart.cartItems.find(item => item.product == req.params.id)
    if (!item) return next(new AppError("product not found", 404))
    item.quantity = req.body.quantity
    calcTotalPrice(cart)
    await cart.save()
    res.status(200).json({ message: "success", cart })
})



const removeItemFromCart = catchError(async (req, res, next) => {
    let cart = await Cart.findOneAndUpdate({ user: req.user._id },
        { $pull: { cartItems: { _id: req.params.id } } }, { new: true })
    calcTotalPrice(cart)
    await cart.save()
    cart || next(new AppError("cart not found", 404))
    !cart || res.status(200).json({ message: "success", cart })
})

const getLoggedUserCart = catchError(async (req, res, next) => {
    let cart = await Cart.findOne({ user: req.user._id })
    cart || next(new AppError("cart not found", 404))
    !cart || res.status(200).json({ message: "success", cart })
})

const clearCart = catchError(async (req, res, next) => {
    let cart = await Cart.findOneAndDelete({ user: req.user._id })
    cart || next(new AppError("cart not found", 404))
    !cart || res.status(200).json({ message: "success", cart })
})

const applyCoupon = catchError(async (req, res, next) => {
    let coupon = await Coupon.findOne({ code: req.body.code, expiredAt: { $gte: Date.now() } })
    if (!coupon) return next(new AppError("Ops. coupon invalid", 404))
    let cart = await Cart.findOne({ user: req.user._id })
    cart.discount = coupon.discount
    await cart.save()
    res.status(200).json({ message: "success", cart })
})







export {
    addToCart,
    updateQuantity,
    removeItemFromCart,
    getLoggedUserCart,
    clearCart,
    applyCoupon
}
