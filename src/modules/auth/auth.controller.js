import { User } from "../../../database/models/user.model.js"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import { AppError } from "../../utils/appError.js"
import { catchError } from "../../middleware/catchError.js"



const signUp = async (req, res, next) => {
    let user = new User(req.body)
    await user.save()
    let token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_KEY)
    return res.status(201).json({ message: "success", token })
}


const signIn = async (req, res, next) => {
    let user = await User.findOne({ email: req.body.email })
    if (user && bcrypt.compareSync(req.body.password, user.password)) {
        let token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_KEY)
        return res.status(201).json({ message: "success", token })
    }
    return next(new AppError("incorrect email or password", 401))
}
const changePassword = async (req, res, next) => {
    let user = await User.findOne({ email: req.body.email })
    if (user && bcrypt.compareSync(req.body.oldPassword, user.password)) {
        await User.findOneAndUpdate({ email: req.body.email }, { password: req.body.newPassword, passwordChangedAt: Date.now() })
        let token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_KEY)
        return res.status(201).json({ message: "success", user, token })
    }
    return next(new AppError("incorrect email or password", 401))
}

const protectedRoutes = async (req, res, next) => {
    let { token } = req.headers
    let userPayload = null
    if (!token) return next(new AppError("unauthorized", 401))
    jwt.verify(token, "secret", (err, payload) => {
        if (err) return next(new AppError(err, 401))
        userPayload = payload
    })
    let user = await User.findById(userPayload.userId)
    if (!user) return next(new AppError("user not found", 404))
    
    if (user.passwordChangedAt) {
        let time = parseInt(user.passwordChangedAt.getTime() / 1000)
        if (time > userPayload.iat) return next(new AppError("invalid token ..... please login again", 401))
    }
    req.user = user
    next()
}


const allowedTo = (...roles) => {
    return catchError((req, res, next) => {
        if (roles.includes(req.user.role)) return next()
        next(new AppError("you not authorized to access this endpoint", 401))
    })
}




export {
    signUp,
    signIn,
    changePassword,
    protectedRoutes,
    allowedTo
}