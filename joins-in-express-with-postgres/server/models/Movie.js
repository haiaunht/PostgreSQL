import pg from "pg"
import _ from "lodash"

const pool = new pg.Pool({
  connectionString: "postgres://postgres:password@localhost:5432/movies_development"
})

class Movie {
  constructor({ id, title, year, genre_id, genreId }) {
    this.id = id
    this.title = title
    this.year = year
    this.genreId = genreId || genre_id
  }

  static async findAll() {
    try {
      const client = await pool.connect()
      const result = await client.query("SELECT * FROM movies;")

      //get the results
      const movieData = result.rows
      const movies = movieData.map(movie => new this(movie))

      //release the connection back to the pool
      client.release()

      return movies
    } catch(err) {
      console.log(err)
      throw(err)
    }
  }

  static async findById(id) {
    try {
      const client = await pool.connect()
      const query = "SELECT * FROM movies WHERE ID = " + id + ";"
      const result = await client.query(query)

      //get the results
      const movieData = result.rows[0]
      const movie = new this(movieData)

      //release the connection back to the pool
      client.release()

      return movie
    } catch(err) {
      console.log(err)
      throw(err)
    }
  }
  
  async genre() {
    const genreFile = await import("./Genre.js")
    const Genre = genreFile.default

    try {
      const client = await pool.connect()
      // const query = `SELECT * FROM genres WHERE ID = ${this.genre_id};`
      const query = `SELECT * FROM genres WHERE ID = ${this.genreId};`
      const result = await client.query(query)

      //get the results
      const relatedGenreData = result.rows[0]
      const relatedGenre = new Genre(relatedGenreData)

      //release the connection back to the pool
      client.release()

      return relatedGenre
    } catch(err) {
      console.log(err)
      throw(err)
    }
  }
}

export default Movie