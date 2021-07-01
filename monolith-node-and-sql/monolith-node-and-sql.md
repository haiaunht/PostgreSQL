So far, we've studied SQL and databases in isolation. It's time to incorporate databases into our programming. In this article, we'll work with SQL in NodeJS.

## Getting Started

```no-highlight
et get monolith-node-and-sql
cd monolith-node-and-sql
yarn install
createdb monolith_quotes_development
```

### Learning Goals

- Create and retrieve data via a NodeJS script
- Integrate a preexisting database into an Express application
- Secure applications by protecting them against SQL injection attacks

### Dev Environment

Something developers will run into often on the job is version conflicts. For this article you will need to be on node version >=14.x to successfully interact with the version of postgres we have installed.

**Check to see if you already have nvm and Node installed.** You can check on both OSX and Windows by running:

```sh
nvm current
```

You should see `v14.8.0` (or higher) appear in response. If not, navigate to either of the below articles to get set up!
- [Installing Node for OSX](https://learn.launchacademy.com/lessons/installing-node-osx)
- [Installing Node for Windows](https://learn.launchacademy.com/lessons/installing-node-windows)

Now that you know you have nvm installed, run the following commands to get set up with Node 14.x:

```sh
nvm install 14
nvm use 14
```

**Note that the above may not change your default Node version. It is setting the Node version you want to use for this terminal session. To set Node version 14.x as your default, run the following:**

```sh
nvm alias default 14
```

## Creating Our Schema

Often as developers, we're called to take data from a text file and place it in a database. Our quotes project comes with a `quotes.txt` file. This file has a list of quotes. Each quote is supplied on an individual line, and there are three fields that we want to track for each line. Each line includes the actual quote, who said it, and what subject it pertains to. This file is known as a delimited text file. In this case, the delimiter is the `semicolon`. Each line in the file represents a row in the table, and each column is separated by a semicolon. Let's populate our database with the information from this file.

First, we need to create our schema to store our list of quotes.


Paste the following Data Definition Language (DDL) into your schema file `server/db/schema.sql`

```sql
CREATE TABLE quotes (
  id SERIAL PRIMARY KEY,
  quote TEXT,
  author VARCHAR(255),
  subject VARCHAR(255)
);
```

Next we'll need to import our schema.

```no-highlight
psql monolith_quotes_development
\i server/db/schema.sql
```

Then close your PSQL session.

```no-highlight
monolith_quotes_development=# \q
```

## Connecting to Our Database

In order to insert these records, we must first programmatically connect to our database. We are going to use `postgres` for our database, which has been included for us. We can see in the `server/package.json` under "dependencies", we have

```no-highlight
"pg": "^8.5.1"
```

_This version of postgres requires Node >=14, which we just ensured!_

To process our `quotes.txt` text file, we'll create a script within `server/db/Seeder.js`.

```javascript
import pg from 'pg'

const pool = new pg.Pool({connectionString:"postgres://postgres:password@localhost:5432/monolith_quotes_development"})
```

***Note*** Some configurations might require a slightly different connectionString. If you are having issues with the pool as written try updating it to `const pool = new pg.Pool({connectionString:"postgres://postgres:postgres@localhost:5432/monolith_quotes_development"})`

In the lines above, we're setting up our "Pool" for connections to the PostgreSQL database. For web applications and other software that will issue a lot of queries, we use a pool to save connection time. Since we'll be issuing multiple queries, the pool will basically maintain our connection to the database so that we don't have to continuously incur that performance penalty.

## Issuing Our First Query

Now that we have our pool established, we can issue our first query. Add the following to the bottom of the `Seeder.js` file

```javascript
class Seeder {
  static async seed() {
    try {
      const result = await pool.query("SELECT * FROM quotes;")
      console.log(result.rows)
      pool.end()
    } catch (error) {
      pool.end()
    }
  }
}

export default Seeder
```

We can run this completed script by running:

```no-highlight
yarn run db:seed
```

Our script for `db:seed` is going to execute this `seed()` method for our `Seeder` class. We should see that the output is an empty array. This makes sense, as we haven't yet inserted any data into our table.

## Seeding the Database

### Working with the line-reader library

When working with large text files, we can't use `fs.readFileSync`. This function will load all of the file's contents into memory. Using this function as we start working with larger volumes of data will start to hit memory thresholds on production machines. So, we need a library that will allow us to read in data one line at a time. That's where the `line-reader` library comes in handy, which has already been added to our server package.json.

Let's then add this to our `db/Seeder.js` script, above the `Seeder` class.

```javascript
import path from "path"
import LineReader from "line-reader"
import { fileURLToPath } from "url"

const pool = new pg.Pool({connectionString:"postgres://postgres:password@localhost:5432/monolith_quotes_development"})

//setup __dirname to work with ESM
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

//assemble where the text file is located
const quotePath = path.join(__dirname, "../../quotes.txt")

//read a line at a time
LineReader.eachLine(quotePath, (line, last, done) => {
  const [quote,author,subject] = line.split(";")
  //output the quote on a specific line
  console.log(quote)

  //signal that we're ready to load in the next line
  done()
})
```

Here, we're using the `LineReader` library to efficiently read through the file, one line at a time. For every line, we'll execute a function with three arguments:

- `line` - The contents of the line. We'll use this to break up the line into its three separate fields.
- `last` - this boolean value will inform us if we're on the last line or not
- `done` - we'll use this to signal to `LineReader` that we're ready to load another line.

If we execute our seed file with `yarn run db:seed`, each quote in the file will be outputted. You should still see the empty array in your output since we haven't added, or inserted, these quotes to our database yet.

### Executing INSERT Statements

Now that we have our script at a place where we can scalably read in source data, let's populate our table. Let's update the `seed` method to let us start inserting these quotes into our database. We can replace the original `try/catch` block with this below:

```javascript
class Seeder {
  static async seed() {
    LineReader.eachLine(quotePath, async (line, last, done) => {
      const [quote,author,subject] = line.split(";")
      // build our SQL query string
      const queryString = `INSERT INTO quotes (quote, author, subject) VALUES ('${quote}', '${author}', '${subject}');`

      //execute our query
      try {
        const result = await pool.query(queryString)
        done()
      } catch (error) {
        console.log(`Error: ${error}`)
        done()
      }
    })
  }
}
```

When we run this, we see a series of syntax errors. Sure, we've built our SQL query correctly knowing what we know about string interpolation, but what about quotes that have the character `'` in them? Or, if an author's name is `O'Neil`?

Here's what the resulting, errant, INSERT statement would look like:

```sql
INSERT INTO quotes (quote, author, subject) VALUES
('Aging seems to be the only available way to live a long life.', 'Kitty O'Neill Collins', 'age')
```

When we try to run this SQL statement our database will complain about an
invalid SQL statement. The single quote within _O'Neill_ closes the
string too early and breaks the statement.

At best, our database refuses to run the statement because it is invalid SQL. At
worst an attacker can exploit this vulnerability to insert specially crafted SQL
fragments to run malicious code in our database. What would our SQL look like if
the user input `a'); DROP TABLE quotes; --`. Note that `--` starts a comment in
SQL. This particular attack is known as [SQL
Injection](http://en.wikipedia.org/wiki/SQL_injection) and is a common malicious
attack performed on websites.

![Little Bobby Tables](https://imgs.xkcd.com/comics/exploits_of_a_mom.png)

[Source](https://xkcd.com/327/)

To prevent this we want to **sanitize** any input that we accept from users and
**escape** special characters like `'` so they don't interfere with the
structure of our SQL. We can use _placeholders_ within a query and then provide
values for those placeholders that get filtered for any malicious characters
before they are inserted into the statement.

With this new and important item in mind, let's modify our query to better handle for this type of input. Replace the code inside the `seed` method with:

```javascript
LineReader.eachLine(quotePath, async (line, last, done) => {
  const [quote,author,subject] = line.split(";")
  // build our SQL query string
  const queryString = "INSERT INTO quotes (quote, author, subject) VALUES ($1, $2, $3);"

  //execute our query
  try {
    const result = await pool.query(queryString, [quote,author,subject])
    //signal that we're ready to load in the next line
    done()
  } catch (error) {
    console.log(`Error: ${error}`)
    done()
  }
})
```

We're issuing an `INSERT` query for each line in the `quotes.txt` file. We use `$1`, `$2`, and `$3` to represent the input of `quote`, `author`, and `subject` respectively.

Just like our `fetch` requests, the `pg` npm package makes use of promises so that we can take action once a query successfully executes. In this case, after the `INSERT` statement is processed, we want to instruct `LineReader` to load the next line from the file.

### Gracefully Draining the Connection Pool

When we've completed our work, we also want to inform PostgreSQL that we're done connecting to it. So, after the last line has been processed, we can "drain" the pool by calling `pool.end()` to signal that we won't be issuing more SQL commands through the connection.

```javascript
LineReader.eachLine(quotePath, async (line, last, done) => {
  const [quote,author,subject] = line.split(";")
  // build our SQL query string
  const queryString = "INSERT INTO quotes (quote, author, subject) VALUES ($1, $2, $3);"

  //execute our query
  try {
    const result = await pool.query(queryString, [quote,author,subject])
    if(last) {
      //drain the pool because we're done connecting
      pool.end()
    }
    done()
  } catch (error) {
    console.log(`Error: ${error}`)
    done()
  }
})
```

Here's the complete contents of `db/Seeder.js` for your reference.

```javascript
import pg from "pg"
import path from "path"
import LineReader from "line-reader"
import { fileURLToPath } from "url"

const pool = new pg.Pool({connectionString:"postgres://postgres:password@localhost:5432/monolith_quotes_development"})

//setup __dirname to work with ESM
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

//assemble where the text file is located
const quotePath = path.join(__dirname, "../../quotes.txt")

class Seeder {
  static async seed() {
   LineReader.eachLine(quotePath, async (line, last, done) => {
      const [quote,author,subject] = line.split(";")
      // build our SQL query string
      const queryString = "INSERT INTO quotes (quote, author, subject) VALUES ($1, $2, $3);"

      //execute our query
      try {
        const result = await pool.query(queryString, [quote,author,subject])
        if (last) {
          //drain the pool because we're done connecting
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
```

We can now execute this file, and if all goes well we will not see any output. Then, we can access our database and confirm that we've successfully written records from the `txt` file.

```no-highlight
psql quotes
quotes=# SELECT count(*) FROM quotes;
```

The output of the above command should show us that we have far more than the 20 expected records in the table.

What will happen if we run this script again? We will duplicate the records again and wind up with even more! If you run into issues like this, you can delete all of the records via `psql` and the following SQL command:

```sql
DELETE FROM quotes;
```

This will remove all records in the `quotes` table. If you'd like the PRIMARY KEY `id` to start at 1 again, we can instead:

```sql
TRUNCATE TABLE quotes;
```

## Using the Database in Our Express Application

To date, we've worked with JSON files and `txt` files in the context of our express applications. But, what happens when we want to interact with a database instead?

We've supplied a starting application for you. You can run the express application with:

```no-highlight
yarn run dev
```

When you navigate to [http://localhost:3000/api/v1/quotes](http://localhost:3000/api/v1/quotes), you'll see a list of quotes, populated directly from the `txt` file we supplied. Take a moment to study `server/routes/api/v1/quotesRouter.js` to understand what is happening in terms of loading the data. You can take a peek at the webpage to see how the data is being returned.

Instead of using the `txt` file, we're going to load this data from our newly seeded database.

First, we need to create our connection pool at the top of our express application.

```javascript
import pg from 'pg'

const pool = new pg.Pool({connectionString:"postgres://postgres:password@localhost:5432/monolith_quotes_development"})
```

Then, we can modify our endpoint to use the database table instead of the `txt` file.

```javascript
quotesRouter.use("/", async (req, res) => {
  try {
    //issue the SQL command
    const client = await pool.connect()
    const result = await client.query("SELECT * FROM quotes;")

    //get the results
    const quotes = result.rows

    //release the connection back to the pool
    client.release()

    //render the template with the database records
    res.json({ quotes: quotes })
  } catch (error) {
    console.error(`Error: ${error}`)
    pool.end()
  }
})
```

Since our schema is well structured, and that we've named our columns intelligently, `result.rows` returns an array of JSON objects.

In this example, we also use `pool.connect` so that we can manage the connection pool well in the context of our backend web application. Once we've issued the query and received the results, we can "release" the `pg` client back to the pool to conserve system resources. We do this by issuing a `client.release()` invocation. Once we've released the client, we can no longer issue queries with it.

Querying the database is faster and provides us with more flexibility. For example, what if we wanted to sort our list of quotes by author?

```javascript
quotesRouter.get("/", (req, res) => {
  pool.connect().then(client => {
    //issue the SQL command
    client.query("SELECT * FROM quotes ORDER BY author").then(result => {
      //get the results
      const quotes = result.rows

      //release the connection back to the pool
      client.release()

      //return the database records
      res.json({ quotes: quotes })
    })
  })
})
```

Above you'll notice that the syntax is a little different than our `try/catch` blocks. Here we are using `.then()` syntax which is a different way we can handle our Promises! You can think of `.then()` as is similar to the `await` keyword. It will wait for what it is being called on to finish executing, and `.then()` will return a Promise. We'll continue using `async` and `await`, but wanted to show you another way to deal with promises.

## Why This Matters

### Seeding Data is a Practical Task

We're often called to populate a database with some initial data. A product manager or business executive typically supplies us with a spreadsheet or text file, and we have to do perform the work of integrating that data into an existing application.

### Most Backend Applications Work with Databases

The majority of today's web applications are supported by a database. PostgreSQL, along with other RBDMS providers, provide us with scalability and wonderful options for managing multiple, concurrent users of our application.

## In Summary

Use the `pg` npm package to connect to PostgreSQL databases from your NodeJS applications. Like with `fetch`, the `pg` package uses promises to facilitate communication with the database server. We can use the `pg` package to both seed our database, and to retrieve and display data in the context of our Express applications.
