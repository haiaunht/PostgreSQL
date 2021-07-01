import pg from "pg"
import path from "path"
import LineReader from "line-reader"
import { fileURLToPath } from "url"

const pool = new pg.Pool({
  connectionString: "postgres://postgres:password@localhost:5432/monolith_adventures_development" })

//setup __dirname to work with ESM
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

//assemble where the text file is located
const adventurePath = path.join(__dirname, "../../adventures.txt")

class Seeder {
  static async seed() {
    LineReader.eachLine(adventurePath, async (line, last, done) => {
      const [ title, location] = line.split(";")
      // build our SQL query string
      const queryString = "INSERT INTO adventures ( title, location) VALUES ($1, $2);"

      //execute our query
      try {
        const result = await pool.query(queryString, [ title, location])
        if (last) {
          //drain the pool because we're done connecting
          console.log("Seeding Complete")
          pool.end()
        }
        done()
      } catch (error) {
        console.log(`Error: ${error}`)
        done()
      }
    })
  }
}

export default Seeder
