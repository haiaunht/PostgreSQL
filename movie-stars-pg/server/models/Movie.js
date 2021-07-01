import pg from "pg"
import fs from "fs"
import _ from "lodash"

const pool = new pg.Pool({
  connectionString:"postgres://postgres:password@localhost:5432/movie-stars-pg"
})

class Movie {
   static async findAll() {
    try {
      const client = await pool.connect()
      const result = await client.query("SELECT * FROM movies;")

      //get the result
      const movies = result.rows

      //release the conncetion back to the pool
      client.release()

      //render the template with records    
      return movies
    } catch (error){
      console.error(`Error: ${error}`)
      pool.end()
    }    
  }

  static async findById(id) {
    try {
      const client = await pool.connect()
      // const result = await client.query(`SELECT * FROM movies WHERE id=${id};`)
      const result = await client.query("SELECT * FROM movies WHERE id= $1", [id])

      //get the result, this one result still rturn an array, so choose [0]
      const movie = result.rows[0]

      //relesase the cooncection back to the pool
      client.release()

      //return movie with the specific id
      return movie
    } catch (error) {
      console.error(`Error: ${error}`)
      pool.end()
    }
  }
}

export default Movie
