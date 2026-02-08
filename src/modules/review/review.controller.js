import { Review } from "../../../database/models/review.model.js"
import { catchError } from "../../middleware/catchError.js"
import { AppError } from "../../utils/appError.js"
import { deleteOne, getAll, getOne } from "../handlers/handlers.js"


const addReview = catchError(async (req, res ,next) => {
    req.body.user = req.user._id
    let isExist = await Review.findOne({ user: req.user._id, product: req.body.product })
    if (isExist) return next(new AppError('you already reviewed this product', 409))
    let review = new Review(req.body)
    await review.save()
   return res.status(201).json({ message: "success", review })
})

const updateReview = catchError(async (req, res, next) => {
    let review = await Review.findOneAndUpdate({_id:req.params.id, user: req.user._id}, req.body, { new: true })
    review ||  next(new AppError("you not allowed to update this review", 404))
    !review ||  res.status(200).json({ message: "success", review })
})

const getAllReviews = getAll(Review)
const getReview = getOne(Review)
const deleteReview = deleteOne(Review)




export {
    addReview,
    getAllReviews,
    getReview,
    updateReview,
    deleteReview
}