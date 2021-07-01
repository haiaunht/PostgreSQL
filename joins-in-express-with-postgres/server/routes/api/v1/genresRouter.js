import express from "express"

import Genre from "../../../models/Genre.js"

const genresRouter = new express.Router()

genresRouter.get("/", async (req, res) => {
  try {
    const genres = await Genre.findAll()
    res.status(200).json({ genres: genres })
  } catch (error) {
    console.log(error)
    res.status(500).json({ errors: error })
  }
})

genresRouter.get("/:id", async (req, res) => {
  try {
    const genre = await Genre.findById(req.params.id)
    genre.movies = await genre.movies()
    res.status(200).json({ genre: genre })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ errors: error })
  }
})

export default genresRouter
