import express from "express"
import clientRouter from "./clientRouter.js"
import carMakesRouter from "./api/v1/carMakesRouter.js"
const rootRouter = new express.Router()

rootRouter.use("/api/v1/car-makes", carMakesRouter)

rootRouter.use("/", clientRouter)

export default rootRouter
