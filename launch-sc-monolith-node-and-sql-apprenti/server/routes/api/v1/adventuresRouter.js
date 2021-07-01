import express from "express"
import Adventure from "../../../models/Adventure.js"

const adventuresRouter = new express.Router()

adventuresRouter.get('/', async (req, res) => {
  try {
    //get and return the list of adventures using the model
    const adventures = await Adventure.findAll()
    res.json({ adventures:adventures })
  } catch (error) {
    console.log(error)
    res.json({ errors: error })
  }
})

adventuresRouter.get('/:id', async (req, res) => {
  try {
    //get and return a single adventure using the model
    const adventure = await Adventure.findById(req.params.id)
    res.json({ adventure:adventure })
  } catch (error) {
    console.log(error)
    res.json({ errors: error })
  }
})

adventuresRouter.post('/', async (req, res) => {
  try {
    //save the posted data to the database and return it, with the id it was given in the database, to the front end.
    const newAdventure = new Adventure(req.body) 
    await newAdventure.save()
    res.json({ newAdventure:newAdventure })
  } catch (error) {
    console.log(error)
    res.json({ errors: error })
  }
})

export default adventuresRouter
