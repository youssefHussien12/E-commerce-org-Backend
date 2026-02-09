process.on('uncaughtException', (err) => {
    console.log('Error', err);
})

import express from "express"
import { dbConn } from "./database/dbConnection.js"
import { bootstrap } from "./src/bootstrap.js"
import { globalError } from "./src/middleware/globalError.js";
import { AppError } from "./src/utils/appError.js";
import cors from 'cors'
import 'dotenv/config'
import { catchError } from "./src/middleware/catchError.js";
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const app = express()
const port = process.env.PORT || 3000
dbConn()
app.use(cors())

app.post("/api/webhook" , express.raw( { type: 'application/json' }),catchError(async (req, res, next) => {
    const sig = req.headers['stripe-signature'].toString()
    const event = stripe.webhooks.constructEvent(req.body,sig, process.env.STRIPE_WEBHOOK_SECRET)
    let checkout 
    if(event.type == 'checkout.session.completed'){
        checkout = event.data.object
    }
    res.status(200).json({ message: "success", checkout })
}))



app.use(express.json())
app.use('/uploads',express.static('uploads'))
bootstrap(app)


app.use((req, res, next) => {
    return next(new AppError(`route not found ${req.originalUrl}`, 404))
})
app.use(globalError)


process.on("unhandledRejection", (err) => {
    console.log("Error", err);
})



app.listen(port, () => console.log(`Example app listening on port ${port}!`))