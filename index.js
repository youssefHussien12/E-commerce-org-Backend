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
import webhookRouter from "./src/modules/webhook/webhook.routes.js";
const app = express()
const port = process.env.PORT || 3000
dbConn()
app.use(cors())
app.use("/api/webhook", webhookRouter)

app.use(express.json())
app.use('/uploads', express.static('uploads'))
bootstrap(app)


app.use((req, res, next) => {
    return next(new AppError(`route not found ${req.originalUrl}`, 404))
})
app.use(globalError)


process.on("unhandledRejection", (err) => {
    console.log("Error", err);
})



app.listen(port, () => console.log(`Example app listening on port ${port}!`))