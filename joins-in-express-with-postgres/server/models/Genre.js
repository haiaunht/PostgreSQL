import pg from "pg"
import _ from "lodash"

const pool = new pg.Pool({
  connectionString: "postgres://postgres:password@localhost:5432/movies_development"
})

class Genre {
  constructor({id, name}) {
    this.id = id
    this.name = name
  }

  static async findAll() {
    try {
      const client = await pool.connect()
      const result = await client.query("SELECT * FROM genres;")

      //get the results
      const genreData = result.rows
      const genres = genreData.map(genre => new this(genre))

      //release the connection back to the pool
      client.release()

      return genres
    } catch(err) {
      console.log(err)
      throw(err)
    }
  }

  static async findById(id) {
    try {
      const client = await pool.connect()
      const query = "SELECT * FROM genres WHERE ID = " + id + ";"
      const result = await client.query(query)

      //get the results
      const genreData = result.rows[0]
      const genre = new this(genreData)

      //release the connection back to the pool
      client.release()

      return genre
    } catch(err) {
      console.log(err)
      throw(err)
    }
  }

  async movies() {
    const movieFile = await import("./Movie.js")
    const Movie = movieFile.default

    try {
      const client = await pool.connect()
      const query = `SELECT * FROM movies WHERE genre_id = ${this.id};`
      const result = await client.query(query)

      //get the results
      const relatedMoviesData = result.rows
      const relatedMovies = relatedMoviesData.map(movie => new Movie(movie))

      //release the connection back to the pool
      client.release()

      return relatedMovies
    } catch(err) {
      console.log(err)
      throw(err)
    }
  }
}

export default Genre