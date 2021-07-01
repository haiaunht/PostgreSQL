import express from "express"

const router = new express.Router()

const clientRoutes = ["/", "/concert-venues/new"];
router.get(clientRoutes, (req, res) => {
  res.render("home")
})

export default router