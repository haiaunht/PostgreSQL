import pg from 'pg'
const pool = new pg.Pool({connectionString:"postgres://postgres:password@localhost:5432/car_associations_development"})

class Seeder {
  static async seed() {
    try {
      const carMakes = [
        {
          name: "Toyota"
        },
        {
          name: "Hyundai"
        },
        {
          name: "Jeep"
        }
      ]

      for(let i=0; i < carMakes.length; i++) {
        const carMake = carMakes[i]
        const queryString = `INSERT INTO car_makes (name) VALUES ('${carMake.name}');`
        await pool.query(queryString)
      }

      const toyotaData = await pool.query("SELECT * FROM car_makes WHERE name = 'Toyota';")
      const toyota = toyotaData.rows[0]
      const hyundaiData = await pool.query("SELECT * FROM car_makes WHERE name = 'Hyundai';")
      const hyundai = hyundaiData.rows[0]
      const jeepData = await pool.query("SELECT * FROM car_makes WHERE name = 'Jeep';")
      const jeep = jeepData.rows[0]

      const carModels = [
        { name: "Camry", carMake: toyota },
        { name: "Prius", carMake: toyota },
        { name: "Elantra", carMake: hyundai },
        { name: "Wrangler", carMake: jeep }
      ]

      for(let i=0; i < carModels.length; i++) {
        const carModel = carModels[i]
        const queryString = `INSERT INTO car_models (name, car_make_id) VALUES ('${carModel.name}', ${carModel.carMake.id});`
        await pool.query(queryString)
      }
      console.log("Seeding complete")
      pool.end()
    } catch (error) {
      console.log(error)
      pool.end()
    }
  }
}

export default Seeder