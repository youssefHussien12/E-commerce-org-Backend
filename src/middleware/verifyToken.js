import jwt from "jsonwebtoken"
import { AppError } from "../utils/appError.js"


export const verifyToken = (req, res, next) => {
    let { token } = req.headers
    jwt.verify(token, "secret", async (err, payload) => {
        if (err) return next(new AppError("invalid token" , 401))
        req.user = payload
        next()
    })

}