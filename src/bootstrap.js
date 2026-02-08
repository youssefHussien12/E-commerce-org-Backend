import addressRouter from "./modules/address/address.routes.js"
import authRouter from "./modules/auth/auth.routes.js"
import brandRouter from "./modules/brand/brand.routes.js"
import cartRouter from "./modules/cart/cart.routes.js"
import categoryRouter from "./modules/category/category.routes.js"
import couponRouter from "./modules/coupon/coupon.routes.js"
import orderRouter from "./modules/order/order.routes.js"
import productRouter from "./modules/product/product.routes.js"
import reviewRouter from "./modules/review/review.routes.js"
import subCategoryRouter from "./modules/subcategory/subcategory.routes.js"
import userRouter from "./modules/users/user.routes.js"
import wishlistRouter from "./modules/wishlist/wishlist.routes.js"


export const bootstrap = (app) => {
    app.use('/api/categories', categoryRouter)
    app.use('/api/subcategories', subCategoryRouter)
    app.use('/api/brands', brandRouter)
    app.use('/api/products', productRouter)
    app.use('/api/users', userRouter)
    app.use('/api/auth', authRouter)
    app.use('/api/reviews', reviewRouter)
    app.use('/api/wishlists', wishlistRouter)
    app.use('/api/addresses', addressRouter)
    app.use('/api/coupons', couponRouter)
    app.use('/api/carts', cartRouter)
    app.use('/api/orders', orderRouter)
}