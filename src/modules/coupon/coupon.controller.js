import { deleteOne, getAll, getOne, updateOne } from "../handlers/handlers.js"
import { catchError } from "../../middleware/catchError.js"
import { Coupon } from "../../../database/models/coupon.model.js"
import { AppError } from "../../utils/appError.js"


const addCoupon = catchError(async (req, res , next) => {
    let isExist = await Coupon.findOne({ code: req.body.code })
    if (isExist) return next(new AppError('code already exist', 409))
    let coupon = new Coupon(req.body)
    await coupon.save()
   return res.status(201).json({ message: "success", coupon })
})

const getAllCoupons = getAll(Coupon)
const getCoupon = getOne(Coupon)
const updateCoupon = updateOne(Coupon)
const deleteCoupon = deleteOne(Coupon)




export {
    addCoupon,
    getAllCoupons,
    getCoupon,
    updateCoupon,
    deleteCoupon
}