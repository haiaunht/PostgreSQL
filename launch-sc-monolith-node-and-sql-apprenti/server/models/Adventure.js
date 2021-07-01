import pg from "pg"
import fs from "fs"
import _ from "lodash"

const pool = new pg.Pool({
  connectionString: "postgres://postgres:password@localhost:5432/monolith_adventures_development"
})

class Adventure {
  constructor({id, title, location}){
    this.id = id
    this.title = title
    this.location = location
  }

  static async findAll() {
    try {
      const client = await pool.connect()
      const result = await client.query("SELECT * FROM adventures;")

      const adventuresData = result.rows
      const adventures = adventuresData.map( adventure => new this(adventure))

      client.release()
      
      return adventures
    } catch (err) {
      console.log(err)
      throw(err)
    }
  }

  static async findById(id) {
    try {
      const client = await pool.connect()
      const result = await client.query("SELECT * FROM adventures WHERE id = $1;", [id])

      const adventure = new this(result.rows[0])

      client.release()

      return adventure

    } catch (err) {
      console.error(`Error: ${error}`)
      throw(err)
    }
  }

  async save() {
    try {
      const client = await pool.connect()
      const query = "INSERT INTO adventures (title, location) VALUES ($1, $2);"
      const values = [this.title, this.location]
      const result = await client.query(query, values)

      const newAdventureData = result.rows[0].id
      this.id = newAdventureData.id
      console.log(newAdventureData)

      client.release()

      return true
    } catch (err) {
      console.log(err)
      return false
    }
  }
}

export default Adventure
