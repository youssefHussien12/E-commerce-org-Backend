import { Router } from "express";
import { addWebhook } from "./webhook.controller.js";
import express from "express"




const webhookRouter = Router()

webhookRouter.post('/',express.raw({ type: 'application/json' }),addWebhook)





export default webhookRouter