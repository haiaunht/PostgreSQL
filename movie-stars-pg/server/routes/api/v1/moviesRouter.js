import express from "express"
import pg from "pg"

import Movie from "../../../models/Movie.js"

const moviesRouter = new express.Router()

moviesRouter.get("/", async (req, res) => {
  try {
    const movies = await Movie.findAll()
    res.json({movies})
  } catch (error) {
    console.log(error)
    res.json({ errors: error })
  }
})

moviesRouter.get("/:id", async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id)
    res.json({movie})
  } catch (error) {
    console.log(error)
    res.json({ errors: error })
  }
})

export default moviesRouter
