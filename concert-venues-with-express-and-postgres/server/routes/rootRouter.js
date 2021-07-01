import express from "express"

import clientRouter from "./clientRouter.js"
import concertVenuesRouter from "./api/v1/concertVenuesRouter.js"

const rootRouter = new express.Router()

rootRouter.use("/api/v1/concert-venues", concertVenuesRouter)

rootRouter.use("/", clientRouter)

export default rootRouter
