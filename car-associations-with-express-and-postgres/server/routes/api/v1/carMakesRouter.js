import express from "express"

import CarMake from "../../../models/CarMake.js"

const carMakesRouter = new express.Router()

carMakesRouter.get("/:id", async (req, res) => {
  try {
    const carMake = await CarMake.findById(req.params.id)

    //Au adding here
    carMake.carModels = await carMake.carModels()
    res.status(200).json({ carMake: carMake })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ errors: error })
  }
})

export default carMakesRouter
