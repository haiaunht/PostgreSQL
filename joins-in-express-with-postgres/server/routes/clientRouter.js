import express from "express";

const router = new express.Router();

const clientRoutes = ["/", "/genres", "/genres/:id", "/movies", "/client"];

router.get(clientRoutes, (req, res) => {
  res.render("home")
});

export default router;
