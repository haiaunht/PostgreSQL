import express from "express"

import Movie from "../../../models/Movie.js"

const moviesRouter = new express.Router()

moviesRouter.get("/", async (req, res) => {
  try {
    const movies = await Movie.findAll()
    res.status(200).json({ movies: movies })
  } catch (error) {
    console.log(error)
    res.status(500).json({ errors: error })
  }
})

export default moviesRouter
