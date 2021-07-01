import pg from "pg"
import _ from "lodash"

const pool = new pg.Pool({
  connectionString: "postgres://postgres:password@localhost:5432/concert_venues_development"
})

class ConcertVenue {
  constructor({id, name, location, capacity}) {
    this.id = id
    this.name = name
    this.location = location
    this.capacity = capacity
  }

  static async findAll() {
    try {
      const client = await pool.connect()
      const result = await client.query("SELECT * FROM concert_venues;")

      //get the results
      const concertVenueData = result.rows
      const concertVenues = concertVenueData.map(concertVenue => new this(concertVenue))

      //release the connection back to the pool
      client.release()

      return concertVenues
    } catch(err) {
      console.log(err)
      throw(err)
    }
  }

  async save() {
    try {
      const client = await pool.connect()

      //use let becasue query is changing as +=, --VERSION 1
      // let query = "INSERT INTO concert_venues (name, location, capacity) VALUES "
      // query += `('${this.name}', '${this.location}', '${this.capacity}')`
      //await client.query(query)

      //VERSION 2
      let query = 'INSERT INTO concert_venues (name, location, capacity) VALUES ($1, $2, $3)'
      await client.query(query, [this.name, this.location, this.capacity])
      
      const result = await client.query("SELECT * FROM concert_venues ORDER BY ID DESC LIMIT 1")

      //result return array of 1 obj so need [0]
      const newVenueData = result.rows[0]

      //assign this new obj to the id that database generate for us
      this.id = newVenueData.id

      //release the connection back to the pool
      client.release()   
      return true

    } catch (err) {
      console.log(err)
      throw(err)
    }    
  }
}

export default ConcertVenue
