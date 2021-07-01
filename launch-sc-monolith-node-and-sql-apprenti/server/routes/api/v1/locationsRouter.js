import express from "express"
import Location from "../../../models/Location.js"

const locationsRouter = new express.Router()

locationsRouter.get('/', async (req, res) => {
  try {
    //get and return the list of Locations using the model
    const locations = await Location.findAll()
    res.json({ locations:locations })
  } catch (error) {
    console.log(error)
    res.json({ errors: error })
  }
})

locationsRouter.get('/:locationId', async (req, res) => {
  try {
    //get and return a single Location using the model
    const location = await Location.findById(req.params.locationId)
    res.json({ location:location })
  } catch (error) {
    console.log(error)
    res.json({ errors: error })
  }
})

export default locationsRouter