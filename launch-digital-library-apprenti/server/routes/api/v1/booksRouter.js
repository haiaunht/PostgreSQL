import express from "express"

import Book from "../../../models/Book.js"

const booksRouter = new express.Router()

booksRouter.get('/', async (req, res) => {
  try {
    const books = await Book.findAll()
    res.json({books:books})
    // or RETURN res.json({books:books}) SAME
  } catch (error) {
    console.log(error)
    res.json({ errors: error })
  }
})

booksRouter.get("/:id", async (req, res) => {
  try {
    //return a book here with the id here
    //+ bonus of return all the notes belong to it
    const book = await Book.findById(req.params.id)

    //IMPORTANT HERE, to get its' notes, just one extra line, EXCEED ONLY
    book.notes = await book.notes()

    res.json({book})
  } catch (error) {
    console.log(error)
    res.json({ errors: error })
  }
})

booksRouter.post("/", async (req, res) => {
  try {    
    console.log(req.body)
    const book = new Book(req.body)
    await book.save()
    res.json({ book })
  } catch (error) {
    console.log(error)
    res.json({ errors: error })
  }
})

export default booksRouter