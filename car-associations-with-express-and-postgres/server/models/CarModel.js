
import pg from "pg"

const pool = new pg.Pool({
  connectionString: "postgres://postgres:password@localhost:5432/car_associations_development"
})

class CarModel {
  constructor({id, name, car_make_id, carMakeId}) {
    this.id = id,
    this.name = name,
    this.carMakeId = carMakeId || car_make_id
  }

  static async findAll() {
    try {
      const client = await pool.connect()
      const result = await client.query("SELECT * FROM car_models;")

       //get the results
       const carModelData = result.rows
       const carModels = carModelData.map(carModel => new this(carModel))
 
       //release the connection back to the pool
       client.release()
 
       return carModels
    } catch (err) {
      console.log(err)
      throw(err)
    }
  }

  static async findById(id) {
    try {
      const client = await pool.connect()
      const query = "SELECT * FROM car_models WHERE ID = " + id + ";"
      const result = await client.query(query)

      //get the results
      const carModelData = result.rows[0]
      const carMake = new this(carModelData)

      //release the connection back to the pool
      client.release()

      return carMake
    } catch(err) {
      console.log(err)
      throw(err)
    }
  }

  async make() {
    const makeFile = await import("./CarMake.js")
    const CarMake = makeFile.default

    try {
      const client = pool.connect()
      const query = `SELECT * from genres WHERE ID = ${this.carMakeId}`
      const result = await (await client).query(query)

      //get the result
      const relatedMakeData = result.rows[0]
      const relatedMake = new CarMake(relatedMakeData)

      client.release()

      return relatedMake

    } catch(err) {
      console.log(err)
      throw(err)
    }    
  }
  
}

export default CarModel
