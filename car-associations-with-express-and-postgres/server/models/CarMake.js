import pg from "pg"
import _ from "lodash"

const pool = new pg.Pool({
  connectionString: "postgres://postgres:password@localhost:5432/car_associations_development"
})

class CarMake {
  constructor({id, name}) {
    this.id = id
    this.name = name
  }

  static async findAll() {
    try {
      const client = await pool.connect()
      const result = await client.query("SELECT * FROM car_makes;")

      //get the results
      const carMakeData = result.rows
      const carMakes = carMakeData.map(carMake => new this(carMake))

      //release the connection back to the pool
      client.release()

      return carMakes
    } catch(err) {
      console.log(err)
      throw(err)
    }
  }

  static async findById(id) {
    try {
      const client = await pool.connect()
      const query = "SELECT * FROM car_makes WHERE ID = " + id + ";"
      const result = await client.query(query)

      //get the results
      const carMakeData = result.rows[0]
      const carMake = new this(carMakeData)

      //release the connection back to the pool
      client.release()

      return carMake
    } catch(err) {
      console.log(err)
      throw(err)
    }
  }

  async carModels() {
    const carModelFile = await import("./CarModel.js")
    const CarModel = carModelFile.default

    try {
      const client = await pool.connect()
      const query = `SELECT * FROM car_models WHERE car_make_id = ${this.id};`
      const result = await client.query(query)

      //get the result
      const relatedModelsData = result.rows
      const relatedModels = relatedModelsData.map( model => new CarModel(model))

      client.release()

      console.log(relatedModels)

      return relatedModels
    } catch (err) {
      console.log(err)
      throw(err)
    }
  }
}

export default CarMake