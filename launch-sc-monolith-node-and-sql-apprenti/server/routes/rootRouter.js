import express from "express"
import adventuresRouter from "./api/v1/adventuresRouter.js"
import clientRouter from "./clientRouter.js"
import locationsRouter from "./api/v1/locationsRouter.js"

const rootRouter = new express.Router()

rootRouter.use("/api/v1/adventures", adventuresRouter)

rootRouter.use("/api/v1/locations", locationsRouter)

rootRouter.use("/", clientRouter)

export default rootRouter
