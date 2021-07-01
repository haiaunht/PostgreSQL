import pg from 'pg'
const pool = new pg.Pool({connectionString: "postgres://postgres:password@localhost:5432/movies_development"})

class Seeder {
  static async seed() {
    try {
      const genres = [
        {name: "Comedy"},
        {name: "Drama"}
      ]

      for(let i=0; i < genres.length; i++) {
        const genre = genres[i]
        const queryString = `INSERT INTO genres (name) VALUES ('${genre.name}');`
        await pool.query(queryString)
      }

      const comedyData = await pool.query("SELECT * FROM genres WHERE name = 'Comedy';")
      const comedy = comedyData.rows[0]
      const dramaData = await pool.query("SELECT * FROM genres WHERE name = 'Drama';")
      const drama = dramaData.rows[0]

      const movies = [
        { title: 'Isle of Dogs', year: 2018, genre: comedy },
        { title: 'What We Do in the Shadows', year: 2014, genre: comedy },
        { title: 'Short Term 12', year: 2013, genre: drama },
        { title: '50/50', year: 2011, genre: drama }
      ]

      for(let i=0; i < movies.length; i++) {
        const movie = movies[i]
        const queryString = `INSERT INTO movies (title, year, genre_id) VALUES ('${movie.title}', ${movie.year}, ${movie.genre.id});`
        await pool.query(queryString)
      }

      pool.end()
    } catch (error) {
      pool.end()
    }
  }
}

export default Seeder