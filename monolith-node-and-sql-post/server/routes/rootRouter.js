import express from "express"
import quotesRouter from "./api/v1/quotesRouter.js"
import clientRouter from "./clientRouter.js"

const rootRouter = new express.Router()

rootRouter.use("/api/v1/quotes", quotesRouter)

rootRouter.use("/", clientRouter)

export default rootRouter
