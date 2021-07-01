import express from "express"

import Quote from "../../../models/Quote.js"

const quotesRouter = new express.Router()

quotesRouter.get('/', async (req, res) => {
  try {
    const quotes = await Quote.findAll()
    res.json({ quotes })
  } catch (error) {
    console.log(error)
    res.json({ errors: error })
  }
})

quotesRouter.get('/:id', async (req, res) => {
  try {
    const quote = await Quote.findById(req.params.id)
    res.json({ quote })
  } catch (error) {
    console.log(error)
    res.json({ errors: error })
  }
})

quotesRouter.post('/', async (req, res) => {
  try {
    console.log(req.body)
    const quote = new Quote(req.body)
    const persistedQuote = await quote.save()
    console.log(persistedQuote)
    res.json({ quote })
  } catch (error) {
    console.log(error)
    res.json({ errors: error })
  }
})

export default quotesRouter
