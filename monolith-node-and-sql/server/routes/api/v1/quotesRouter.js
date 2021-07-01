import express from "express"
import pg from "pg"

const quotesRouter = new express.Router()

const pool = new pg.Pool({connectionString:"postgres://postgres:password@localhost:5432/monolith_quotes_development"})

quotesRouter.use("/", async (req, res) => {
  try {
    //issue the SQL command
    const client = await pool.connect()
    const result = await client.query("SELECT * FROM quotes;")

    //get the results
    const quotes = result.rows

    //release the connection back to the pool
    client.release()

    //render the template with the database records
    res.json({ quotes: quotes })
  } catch (error) {
    console.error(`Error: ${error}`)
    pool.end()
  }
})

export default quotesRouter
