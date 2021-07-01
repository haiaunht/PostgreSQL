import pg from "pg"
import fs from "fs"
import _ from "lodash"

const pool = new pg.Pool({
  connectionString: "postgres://postgres:password@localhost:5432/monolith_adventures_development"
})

class Location {
  constructor({location, name}) {
    this.location = location
    this.name = name
  }

  static async findAll() {
    try {
      const client = await pool.connect()
      const result = await client.query("SELECT * FROM locations;")

      const locationsData = result.rows
      const locations = locationsData.map( location => new this(location))

      client.release()
      
      return locations
    } catch (err) {
      console.log(err)
      throw(err)
    }
  }

  static async findById(id) {
    try {
      const client = await pool.connect()
      const query = `${this.id}`
      console.log(query)
      const result = await client.query("SELECT * FROM locations WHERE location = $1", [query])
      


      const lacationData = result.rows[0]
      const location = new this(lacationData)
      console.log(location)

      client.release()

      return location

    } catch (err) {
      console.error(`Error: ${error}`)
      throw(err)
    }
  }
}

export default Location