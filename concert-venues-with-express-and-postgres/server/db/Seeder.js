import pg from 'pg'
const pool = new pg.Pool({connectionString:"postgres://postgres:password@localhost:5432/concert_venues_development"})

class Seeder {
  static async seed() {
    try {
      const record = await pool.query("INSERT INTO concert_venues(name,location,capacity) VALUES('Palladium', 'Worcester MA', '2000') ")
      const result = await pool.query("SELECT * FROM concert_venues;")
      console.log(result.rows)
      pool.end()
    } catch (error) {
      pool.end()
    }
  }
}

export default Seeder
