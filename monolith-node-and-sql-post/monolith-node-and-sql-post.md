We're going to continue working in the quotes database from the monolith-node-and-sql article. Now that we've got our data retrieval in order, let's work out our data persistence.

## Getting Started

```no-highlight
et get monolith-node-and-sql-post
cd monolith-node-and-sql-post

yarn install

dropdb monolith_quotes_development
createdb monolith_quotes_development

psql monolith_quotes_development // enter the psql prompt
\i server/db/schema.sql // import your schema
\q // quit the psql prompt

yarn run db:seed // loads the data from the txt file to the database
yarn run dev // boots your express server you can also run yarn run dev:debug to debug in express
yarn run dev:client (in a new tab or terminal instance) // boots your webpack server for React

```

### Learning Goals

- Use the MVC Pattern to create routes capable of persisting data from the front end React form
- Understand the interaction between API Router and the Model

## What we are starting with

Remember React? We have a full fledged react front end for you!

```javascript
import React from 'react'
import { BrowserRouter, Route, Switch } from "react-router-dom"
import { hot } from "react-hot-loader/root"

import QuotesList from "./QuotesList"
import QuoteForm from "./QuoteForm"
import QuoteShow from "./QuoteShow"

import "../assets/main.css"

const App = (props) => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/quotes" component={QuotesList} />
        <Route exact path="/quotes/new" component={QuoteForm} />
        <Route exact path="/quotes/:id" component={QuoteShow} />
      </Switch>
    </BrowserRouter>
  )
}

export default hot(App)
```

You can see that we have a list, a form, and a show page. This will allow us to work with:
-  `findAll()`
- `findById(id)`
- `save()`

at the model level in express.

In conjunction with the `api/v1/quotesRouter` we can use those methods to return data to React using
- `quotesRouter.get('/')`
- `quotesRouter.get(/:id)`
- `quotesRouter.post('/')`

Let's take a look under the hood!

## Lists

Our `QuotesList` in React will issue a fetch call to the quotesRouter `api/v1/quotes`. This `get` request will hit the following endpoint.

***Note that we are using the `async` keyword inside of our route now. Whenever we are retreving data with NodeJS we want to make sure to do it asynchronously to ensure we have time for the database to return the information we're looking for.***

```javascript
//server/routes/api/v1/quotesRouter.js
quotesRouter.get('/', async (req, res) => {
  try {
    const quotes = await Quote.findAll()
    res.json({ quotes })
  } catch (error) {
    console.log(error)
    res.json({ errors: error })
  }
})
```

As we can see the router is leveraging `Quote.findAll()`, a static method on the model.

```javascript

//server/models/Quote.js

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
```

Looking over this method we can see that again we are using `async` and `await` to ensure that we have all of our data before moving on to try and return it. We define our `client` which builds the connection based on the `pool` we set up at the top of the file. We then await the results of our query! The `client.query` method allows us to pass an SQL query into it and retrieve data from the database! Because that takes time, we use the `await` keyword again to ensure that the data has time to populate. The `result` will need to be broken down into `rows` in order for us to work with it. Here we've done that with `const quoteData = result.rows` (`.rows` being given to us in the return from the `query()`).

Once we have our data formatted the way we want it we map over it using `  const quotes = quoteData.map(quote => new this(quote))` which will return a new Quote object for each row in the results! After we release our connection to the database with `client.release()` we return the `quotes` up to the router. Our router passes it back along to React  

```javascript
  const quotes = await Quote.findAll()
  res.json({ quotes })
```

And React displays it to our user!
(You can take a look at QuotesList to see how React is handling this part of things!)

## Find by Id

We've learned about Show pages in React. They serve up a single instance of the relevant type of thing we are working with. This makes use of a lot of the same functionality that we use for our Index, let's look at the differences.

```javascript
quotesRouter.get('/:id', async (req, res) => {
  try {
    const quote = await Quote.findById(req.params.id)
    res.json({ quote })
  } catch (error) {
    console.log(error)
    res.json({ errors: error })
  }
})
```

Here we use the dynamic id passed to us by the `fetch` from the front end. We call on `Quote.findById` and pass in `req.params.id` as an argument. This will look to our model to retreive the data for us!

```javascript
//...model above through the findAll() method

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

//model continues with `async save()`
```

We see a very similar pattern to find all! Here though, we take in an `id` as an argument, and in our `query` we use the id and the SQL `WHERE` clause. This allows us to ensure we only grab the record with that specific `id`!

You also will note `  const quoteData = result.rows[0]` because `result.rows` will give us an array we need to ensure we are only passing the records foward to create a Quote object on the next line `const quote = new this(quoteData)`.

This is functionally equivalent to saying `const quote = new this(result.rows[0])` but is a little easier to read for most folks.

We then `release()` the client to close our active connection, and return the `quote` to the router to pass to React.

```javascript
//quotesRouter
const quote = await Quote.findById(req.params.id)
res.json({ quote })
```

Take a look at QuoteShow to see the React side of things!

## Creating new records with Post and Save()

In our react app we have our form reaching out to `api/v1/quotes` using the `POST` method.

```javascript
quotesRouter.post('/', async (req, res) => {
  try {
    console.log(req.body)
    const quote = new Quote(req.body)
    const persistedQuote = await quote.save()
    console.log(persistedQuote)
    res.json({ quote })
  } catch (error) {
    console.log(error)
    res.json({ errors: error })
  }
})
```

Once again, we are using `async` and `await` to ensure that our database has time to process our request and get us our data.

Here we see that we are creating our new `Quote` in the router itself. We then call the `.save()` method on our `Quote`. We assign it to a variable so that we can use `await` to ensure the data is complete before trying to move on.

The `save()` method in the model looks like this:

```javascript
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
```

As you may have guessed... `async` and `await` are prominently featured here as well!
We also see that our `query` looks a bit different. Here we are using the `INSERT INTO` SQL statement. We have to tell it which fields are on the table `(quote, author, subject)` and also what values we are inserting.

```javascript
let query = "INSERT INTO quotes (quote, author, subject) VALUES ("
query += `'${this.quote}', '${this.author}', '${this.subject}')`
```

Let's take a closer look here at what's going on. SQL needs single quotes around its strings, but we also need the query in string format for javascript. The best way to achieve this is to build out as much of the string as you can without interpolation, and then add onto the query with `+=` so you can see that we have our string `'${this.quote}', '${this.author}', '${this.subject}')` in the backticks, allowing us to use the JS variables from our Quote object. The end result will be a query

INSERT INTO quotes (quote, author, subject) VALUES 'textofquote', 'authorofquote', 'subjectofquote') which SQL can happily digest and save for us.

The last piece of the puzzle ensures that our object is updated with the ID that is generated by the database when the quote is saved to the table.

```javascript
const result = await client.query("SELECT * FROM quotes ORDER BY ID DESC LIMIT 1")
const newQuoteData = result.rows[0]
  this.id = newQuoteData.id
//release the connection back to the pool
client.release()
return true
```

We don't need to return the object back to the router because it already has
```javascript
//quotesRouter.post ...
const quote = new Quote(req.body)
const persistedQuote = await quote.save()
```

if the await `quote.save()` returns false, then we will fall down to our `catch `block  in the router and `res.json({errors:error})` instead of sending `res.json({quote})` back to react .

## Why This Matters

### Most Backend Applications Work with Databases

The majority of today's web applications are supported by a database. PostgreSQL, along with other RBDMS providers, provide us with scalability and wonderful options for managing multiple, concurrent users of our application.

### Allows us to provide our users with a meaningful way to provide data
Most databases are built through a combination of reading in files and users entering data into a form or internal application.
Using the power of `fetch` we can use all of our tools in React to make this experience a good one for our users!

## In Summary

Use the `pg` npm package to connect to PostgreSQL databases from your NodeJS applications. Like with `fetch`, the `pg` package uses promises to facilitate communication with the database server. We can use the `pg` package to both seed our database, and to retrieve and display data in the context of our Express applications.

Use `fetch` from our front end to leverage the Express server and it's ability to connect to the database through `pg`. This keeps our concerns very separated. Our database stores our information. Our server manages the formatting of the data both for retrieval and storage. Our React frontend is responsible for displaying the data passed forward by the server, and passing the requests for data back to the server.

This cycle is what's known as Full Stack Development!
