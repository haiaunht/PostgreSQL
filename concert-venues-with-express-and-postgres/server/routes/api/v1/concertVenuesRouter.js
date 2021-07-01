import express from "express"

import ConcertVenue from "../../../models/ConcertVenue.js"

const concertVenuesRouter = express.Router()

concertVenuesRouter.get("/", async (req, res) => {
  try {
    const concertVenues = await ConcertVenue.findAll()
    res.json({ concertVenues })
  } catch (error) {
    console.log(error)
    res.json({ errors: error })
  }
})

concertVenuesRouter.post("/", async (req, res) => {
  try {
    console.log("MAKE save() in Model and persist here")
    const venue = new ConcertVenue(req.body)
    venue.save()
    
    res.json({ venue })
  } catch {
    console.log(error)
    res.json({ errors: error })
  }
})

export default concertVenuesRouter
