import pg from "pg"
import fs from "fs"
import _ from "lodash"

const pool = new pg.Pool({
  connectionString: "postgres://postgres:password@localhost:5432/monolith_quotes_development"
})

class Quote {
  constructor({quote, author, subject,id=null}) {
    this.id = id
    this.quote = quote
    this.author = author
    this.subject = subject
  }

  static async findAll() {
    try {
      const client = await pool.connect()
      const result = await client.query("SELECT * FROM quotes;")

      //get the results
      const quoteData = result.rows
      // note the use of the `this` keyword
      const quotes = quoteData.map(quote => new this(quote))

      //release the connection back to the pool
      client.release()

      return quotes
    } catch(err) {
      console.log(err)
      throw(err)
    }
  }

  static async findById(id) {
    try {
      const client = await pool.connect()
      const query = "SELECT * FROM quotes WHERE ID = " + id + ";"
      const result = await client.query(query)

      //get the results
      const quoteData = result.rows[0]
      const quote = new this(quoteData)

      //release the connection back to the pool
      client.release()

      return quote
    } catch(err) {
      console.log(err)
      throw(err)
    }
  }

  async save() {
    try {
      const client = await pool.connect()
      let query = "INSERT INTO quotes (quote, author, subject) VALUES ("
      query += `'${this.quote}', '${this.author}', '${this.subject}')`
      await client.query(query)
      const result = await client.query("SELECT * FROM quotes ORDER BY ID DESC LIMIT 1")
      const newQuoteData = result.rows[0]
        this.id = newQuoteData.id
      //release the connection back to the pool
      client.release()

      return true
    } catch(err) {
      console.log(err)
      throw(err)
    }
  }
}

export default Quote
