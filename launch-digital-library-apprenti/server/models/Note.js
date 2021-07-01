import pg from "pg"

const pool = new pg.Pool({
  connectionString: "postgres://postgres:postgres@localhost:5432/launch_digital_library_development"
})

class Note {
  constructor({id, date, title, body, bookId, book_id }) {
    this.id = id,
    this.date = date,
    this.title = title,
    this.body = body,
    this.bookId =  bookId || book_id
  }

  static async findAll() {
    try {
      const client = await pool.connect()
      const result = await client.query("SELECT * FROM notes;")

      //get the results
      const notesData = result.rows
      const notes = notesData.map(note => new this(note))

      //release the connection back to the pool
      client.release()

      return notes
    } catch(err) {
      console.log(err)
      pool.end()
      //throw(err)
    }
  }

  static async findById(id) {
    try {
      const client = await pool.connect()
      const query = "SELECT * FROM notes WHERE ID = $1;" 
      const result = await client.query(query, [id])

      //get the results
      const noteData = result.rows[0]
      const note = new this(noteData)

      //release the connection back to the pool
      client.release()

      return note
    } catch(err) {
      console.log(err)
      pool.end()
    }
  }

  async save() {
    try {
      const client = await pool.connect()

      //VERSION 1
      // let query = "INSERT INTO notes (date, title, body, book_id) VALUES ($1, $2, $3, $4);"      
      // await client.query(query, [this.date, this.title, this.body, this.bookId])      
      // const result = await client.query("SELECT * FROM notes ORDER BY ID DESC LIMIT 1")
      // const newNoteData = result.rows[0] 

      //VERSION 2
      let query = "INSERT INTO notes (date, title, body, book_id) VALUES ($1, $2, $3, $4) RETURNING id;"      
      const values = [this.date, this.title, this.body, this.bookId]  
      const result = await client.query(query, values)
      const newNoteData = result.rows[0].id      
      
      this.id = newNoteData.id
      console.log(newNoteData)

      //release the connection back to the pool
      client.release()

      return true
    } catch(err) {
      console.log(err)
      pool.end()
      return false
    }
  }

  async book() {
    const bookFile = await import("./Book.js")
    const Book = bookFile.default

    try {
      const client = await pool.connect()
      const query = `SELECT * FROM books WHERE ID = ${this.bookId};`
      const result = await client.query(query)

      //get the results
      const relatedBookData = result.rows[0]
      const relatedBook = new Book(relatedBookData)

      //release the connection back to the pool
      client.release()

      return relatedBook
    } catch(err) {
      console.log(err)
      pool.end()
    }
  }

}

export default Note