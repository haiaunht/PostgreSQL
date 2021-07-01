import express from "express"

import Note from "../../../models/Note.js"

const notesRouter = new express.Router()

notesRouter.get('/', async (req, res) => {
  try {
    const notes = await Note.findAll()
    res.json({notes:notes})
  } catch (error) {
    console.log(error)
    res.json({ errors: error })
  }
})


notesRouter.post("/", async (req, res) => {
  try {    
    console.log(req.body)
    const note = new Note(req.body)
    console.log("---- IN MY NOTE ROUNTER => " + note.bookId)
    await note.save()
    return res.json({ note })
  } catch (error) {
    console.log(error)
    return res.json({ errors: error })
  }
})

export default notesRouter