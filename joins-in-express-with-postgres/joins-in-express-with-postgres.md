In this article we'll explore how to query for related records via associations that we define on our models.

### Learning Goals

- Review the React UI necessary to present related records
- Determine how to setup a schema that facilitates queries for related objects
- Define associations on the model level in order to get access to join queries
- Understand how join queries can be used in the context of an Express app

### Getting Started

```no-highlight
et get joins-in-express-with-postgres
cd joins-in-express-with-postgres
createdb movies_development
yarn install
```

```
psql movies_development
\i server/db/schema.sql
\q
```

```
yarn run db:seed
yarn run dev
```

In a second tab:

```
yarn run dev:client
```

For this assignment, files and code have already been created for you. Navigating to <http://localhost:3000> should show you the text "My Movie Genres" on the page with two genres listed.

Navigate to `/genres` and `/movies` to familiarize yourself with the current application. The `/genres/:id` path is set up but will be breaking until we code through the below. These routes render a list of genres, a list of movies, and details for a genre including related movies, respectively. Ensure that you familiarize yourself with each of the components in the `client/src/componenents` folder to get a sense of the frontend UI.

### Associated Records

Up until this point, our applications have frequently used only one singular "entity" or "resource". That is, our applications have been mostly concerned with rendering one type of record from our database, e.g. articles, recipes, groceries, unicorns, etc. However, once we've started adding more resources - and subsequently, more tables and models - we will want to be efficient in the way that we query for our records. For instance, given an individual teacher, how would we query for that teacher's related students? Defining **associations** on our models can give us a shorthand for querying related records.

### Mapping out Associations with ER Diagrams

In this application, we will work with the resources of genres and movies.

![Image of the one-to-many relationship between genres and movies][er-diagram-image]

An **ER Diagram** is an _Entity Relationship Diagram_, which gives us a visual representation of the associations at play in our database. We'll create boxes to indicate each of our tables, and will use _chicken feet_, or [_crow's foot notation_][crows-foot-notation], to show which table has many associated records on the other table.

The ER diagram above displays the relationship between genres and movies. For a given genre, there can be many related movies. However, a given movie in this case can only belong to a single genre. **Note: while technically a movie could be a part of many genres, we will consider a simpler relationship for this lesson**.

In this way, there is a "one-to-many" relationship between genres and movies. A genre has many movies, and a movie belongs to one genre.

### Schema and Associations

The schema for this application is mostly standard, but we need to ensure that a foreign key is designated on one of the two related tables to properly relate one movie record with one genre record. **In a one-to-many relationship, the resource that there are "many" of will usually be responsible for storing the foreign key.**

We can see how this is articulated in our code by examining the provided `server/db/schema.sql`. First, we can see that our schema for the "genres" table is a standard schema with no special columns or properties for associated records.

```js
CREATE TABLE genres (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL
);
```

In the below schema for our "movies" table, however, we will note that because this is the schema for the resource that there are "many" of, we have to define a new column for storing the foreign key `genre_id`.

```js
CREATE TABLE movies (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  year INTEGER NOT NULL,
  genre_id INTEGER REFERENCES genres(id)
);
```

Specifically, we see this at play here:

```js
genre_id INTEGER REFERENCES genres(id)
```

In the line above, we store the id of the genre that a given new movie will belong and relate to. As far as our database is concerned, this is just a number that our "movies" table knows it can use to reference our "genres" table.

The movie "Short Term 12" is a drama, and if we were to look into our database we would see that the `id` for the genre record for "drama" is `2`. Thus, in order to properly create the "Short Term 12" movie record and relate it to "drama", we would designate its `genre_id` as `2`. For example:

```js
INSERT INTO movies (title, year, genre_id) VALUES('Short Term 12', 2012, 2);
```

With the appropriate foreign key column, our database is set up for queries that rely on the relationship between the `genre_id` column on `movies` and the `id` column on `genres`.

> _A Note about our `genre_id`_: The one tricky thing about our `genre_id` is that our database wants to name this attribute with snake_case, but JavaScript likes to name our attributes with camelCase. To work around this, we handle for both options in our `Movie` class constructor: one as provided to us by Postgres as `genre_id`, and one provided to us from our React frontend as `genreId`. We choose to store the _instance variable_ in camelCase as `this.genreId`. We can see this in our `Movie` constructor, shown here:

```js
constructor({ id, title, year, genre_id, genreId }) {
  this.id = id
  this.title = title
  this.year = year
  this.genreId = genreId || genre_id
}
```

### Setting Up Models with Associations

So far, we have set up our database to have foreign key references between one table and another. However, we don't have any way to quickly and easily get related records using methods on our model at this point!

Our current `Genre` and `Movie` models have been set up for standard `findAll` and `findById` queries, but in order to leverage the power of an association, we will need to define some instance methods for our genres and movies.

We'll start with our `Genre` class. For each individual genre object, we want to be able to call a method, `.movies()`, to get all movies related to that genre. In other words, we want to be able to call:

```js
const drama = await Genre.findById(2)
await drama.movies()
```

In order to do so, we'll need to add the below instance method to our `Genre` class:

```js
// server/src/models/Genre.js

class Genre {
  // ...

  async movies() {
    import Movie from "./Movie.js"
    try {
      const client = await pool.connect()
      const query = "SELECT * FROM movies WHERE genre_id = " + this.id + ";"
      const result = await client.query(query)

      //get the results
      const relatedMoviesData = result.rows
      const relatedMovies = relatedMoviesData.map(movie => new Movie(movie))

      //release the connection back to the pool
      client.release()

      return relatedMovies
    } catch(err) {
      console.log(err)
      throw(err)
    }
  }
}
```

In thinking about our "one-to-many" relationships, we can also think of them in the frame of reference of "parent-child" relationships, where our "one" side is the parent, and our "many" side is the child. In this example, we can consider the `Genre` model the "parent" model, and define its association accordingly. Above, we define an instance method `movies()`. This method queries the `movies` table for all movies with a `genre_id` matching the given genre's `id`. It then creates a `Movie` object for each movie record, and returns the resulting array of `Movie` objects.

You'll notice that we import `Movie` inside of this method. In order to make new `Movie` records, we need to import the `Movie` class. However, we need to avoid what's called a "circular reference" between our models (where both files import each other), so we can't import it at the top of the file! Instead, we need to import it here in our association method.

Now, let's take a look at the inverse side of the relationship:

```js
// server/src/models/Movie.js

class Movie {
  // ...

  async genre() {
    import Genre from "./Genre.js"
    try {
      const client = await pool.connect()
      const query = "SELECT * FROM genres WHERE ID = " + this.genreId + ";"
      const result = await client.query(query)

      //get the results
      const relatedGenreData = result.rows[0]
      const relatedGenre = new Genre(relatedGenreData)

      //release the connection back to the pool
      client.release()

      return relatedGenre
    } catch(err) {
      console.log(err)
      throw(err)
    }
  }
}
```

For our `Movies` model, we define the inverse relation; we will need both association methods in order to access related data in both directions! This time, we use the movie's `genreId` to find the matching `Genre` record in the `genres` table.

Note: on the `Genre` model we defined an association of `movies`, while on the `Movie` model we defined a relation of `genre`. The "many" side of our associations (here, "movies") should generally be pluralized, while the "one" side should generally be singular in order to be appropriately semantic when used. This makes sense if we say it out loud: one genre "has many _movies_", and one movie "belongs to a _genre_".

With the correct association methods defined on `Genre` and `Movie`, we can now use these methods to query for associated data quickly and easily.

### Using Association Queries in API Endpoints

To see how we would use these queries in action, take a look at the below routes which are set up in the `genresRouter`:

```js
// server/src/routes/genresRouter.js

genresRouter.get("/", async (req, res) => {
  try {
    const genres = await Genre.findAll()
    res.status(200).json({ genres: genres })
  } catch (error) {
    console.log(error)
    res.status(500).json({ errors: error })
  }
})

genresRouter.get("/:id", async (req, res) => {
  try {
    const genre = await Genre.findById(req.params.id)
    genre.movies = await genre.movies()
    res.status(200).json({ genre: genre })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ errors: error })
  }
})
```

For the index route of `/api/v1/genres`, we're only showing the names of the genre, so we don't actually need access to the related movies. As such, no association method is needed. Instead, we use the `findAll()` method to retrieve all of the genre records as objects.

However, for the `/api/v1/genre/:id` show route, we want to show both the name of the genre, as well as the movies that are tied to that genre! In other words, we need to retrieve only those movie records for a specific genre: e.g., for the genre of "comedy" we shouldn't see the movie "Titanic" in the returned list of records. This is where we can leverage the `movies()` method.

The `movies()` method is called on an _instance_ of a model. Here, all we need to do is designate which instance we are trying to retrieve the related records for.

Zooming in on the relevant code:

```js
// server/src/routes/genresRouter.js

const genre = await Genre.findById(req.params.id)
genre.movies = await genre.movies()
res.status(200).json({ genre: genre })
```

Here, we first query for the appropriate genre using the `id` from our URL. Then, we query for the related movies for that specific genre using `genre.movies()`. We store those movies as a nested attribute of our `genre`, so that we will be able to call `genre.movies` on our frontend. Finally, we send the built-out `genre` in our response body. You can go to <http://localhost:3000/api/v1/genres/1> to check it out, as well as navigating to <http://localhost:3000/genres/1> to see our React frontend at work with this related data.

The inverse also works:

```js
const movie = await Movie.findById(3)
movie.genre = await movie.genre()
```

Now that our associations are set up correctly using our association methods, we can continue to use those associations throughout our app!

#### A Note on Nested Data

As far as our React frontend is concerned, if it's looking for nested data, it needs to be given a heads up. For example, let's open up `GenreShowPage` to see what we mean.

When we attempt to render all of the `MovieTile`s in this component, we `map()` over our `movies` array:

```js
const movieTileComponents = genre.movies.map((movieObject) => {
  return <MovieTile key={movieObject.id} {...movieObject} />
})
```

Due to this functionality, it's extremely important that we set up our initial state properly.

For example, you may think that you could simply set your initial `genre` state up as so:

```js
const [genre, setGenre] = useState({})
```

Here, we're setting `genre` to an initial state of an empty object. This is all well and good until our `map()` function tries to run on initial load: we will get an error telling us that `genre.movies` is undefined, and we can't map over it.

The solution here is to pre-set `genre.movies` to an empty array, so that our React component has a "heads up" that a `movies` array will be provided as a part of the genre:

```js
const [genre, setGenre] = useState({ movies: [] })
```

Now, `genre.movies` will be an empty array on initial load, instead of `undefined`, and we will not encounter an error.

### Why This Matters

While the examples above show a simple use case, our application will need the efficiency of associations as it grows in scale. By using association methods on our models, we can use the power of SQL join functionality to find associated records in a well-organized and efficient way. This helps our code to be more readable _and_ allows it to run more quickly!

### In Summary

In order to properly associate models and their records, we need to construct an ER diagram, generate the appropriate schema for our tables given the relationships between our records, and then define the association on the model level with instance methods. This association allows us to query related records more easily.

[crows-foot-notation]: https://www.vertabelo.com/blog/crow-s-foot-notation/
[er-diagram-image]: https://s3.amazonaws.com/horizon-production/images/OneManyRelations.png
