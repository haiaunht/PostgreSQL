import express from "express"
import moviesRouter from "./api/v1/moviesRouter.js"
import clientRouter from "./clientRouter.js"

const rootRouter = new express.Router()

rootRouter.use("/api/v1/movies", moviesRouter)

rootRouter.use("/", clientRouter)

export default rootRouter
