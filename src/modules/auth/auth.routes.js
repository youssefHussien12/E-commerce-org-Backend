import { Router } from "express";
import { changePassword, signIn, signUp } from "./auth.controller.js";
import { catchError } from "../../middleware/catchError.js";
import { checkEmail } from "../../middleware/checkEmail.js";

const authRouter = Router()



authRouter.post('/sign-up', checkEmail,catchError(signUp))
authRouter.post('/sign-in', catchError(signIn))
authRouter.patch('/change-password', catchError(changePassword))



export default authRouter