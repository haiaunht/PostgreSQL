import express from "express"

const router = new express.Router()

const clientRoutes = ["/adventures", "/adventures/new", "/adventures/:id", "/locations", "/locations/:locationId"]
router.get(clientRoutes, (req, res) => {
  res.render("home")
})

export default router
