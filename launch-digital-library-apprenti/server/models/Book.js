import pg from "pg"
import _ from "lodash"

const pool = new pg.Pool({
  connectionString: "postgres://postgres:postgres@localhost:5432/launch_digital_library_development"
})

class Book {
  constructor({id, title, author, pagecount, description, fiction}) {
    this.id = id,
    this.title = title,
    this.author = author,
    this.pagecount = pagecount,
    this.description = description,
    this.fiction = fiction
  }

  static async findAll() {
    try {
      const client = await pool.connect()
      const result = await client.query("SELECT * FROM books;")
  
      const booksData = result.rows
      const books = booksData.map(book => new this(book))
  
      client.release()    
      return books

    } catch (err) {
      console.log(err)
      pool.end()
    }
  }

  static async findById(id) {
    try {
      const client = await pool.connect()      
      const result = await client.query("SELECT * FROM books WHERE id= $1", [id])
      
      const book = new this(result.rows[0])
      //const newBook = new this(book) -- to be consider and return new Book
      client.release()
      
      return book
    } catch (error) {
      console.error(`Error: ${error}`)
      pool.end()
    }
  }

  async save() {
    try {
      const client = await pool.connect()
      let query = "INSERT INTO books (title, author, pageCount, description, fiction) VALUES ($1, $2, $3, $4, $5);"
      //query += `('${this.title}', '${this.author}', '${this.pagecount}', '${this.description}', '${this.fiction}')`
      const values = [this.title, this.author, this.pagecount, this.description, this.fiction]
      await client.query(query, values)

      const result = await client.query("SELECT * FROM books ORDER BY ID DESC LIMIT 1")
      const newBookData = result.rows[0]      
      this.id = newBookData.id

      //release the connection back to the pool
      client.release()

      return true
    } catch(err) {
      console.log(err)
      pool.end()
    }
  }

  async notes() {
    const noteFile = await import("./Note.js")
    const Note = noteFile.default

    try {
      const client = await pool.connect()
      const query = `SELECT * FROM notes WHERE book_id = ${this.id};`
      const result = await client.query(query)

      //get the results
      const relatedNoteData = result.rows
      const relatedNotes = relatedNoteData.map(note => new Note(note))

      //release the connection back to the pool
      client.release()

      return relatedNotes
    } catch(err) {
      console.log(err)
      throw(err)
    }
  }
}

export default Book