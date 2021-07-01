## Introduction

In this exercise, you will create and set up a `movies` table in the database. After doing this you will the necessary queries to already created API endpoints to return all of the movies in the database.

## Getting Started

```no-highlight
et get movie-stars-pg
cd movie-stars-pg
dropdb movie-stars-pg
createdb movie-stars-pg
yarn install
```

Remember to run your code in two terminals:

```no-highlight
yarn run dev
```

In a second tab

```no-highlight
yarn run dev:client
```

## Instructions

A `MoviesIndex` component has been provided for you. Within this component there is a `fetch` making a GET request to `/api/v1/movies`. This endpoint has also been created for you, but it is currently incomplete.

If you visit <http://localhost:3000/api/v1/movies>, you'll see that the only thing the endpoint is returning is the string:

```no-highlight
"Instead we should make use of a method on the Movie class to return all movie records as a json object."
```

You can also navigate to <http://localhost:3000/movies> to load the `MoviesIndex` component, but at this point it is only displaying the header:

```html
<h1>All the movies!</h1>
```
Time to create some movies!

## Your Goals

- Create a `movies` table in the `movie-stars-pg` database that was created in the getting started steps. A `title` and `genre` field are required, while a `description` should be optional.

- While you can type these commands out again and again if we have to drop our database, it will be easier in the long run to create a `schema.sql` that can house all of our sql commands we want to run to set up our tables.

- Make use of `psql` in your terminal to run a few insert queries, so that there are movies in the database to interact with.  Just 2 to 3 is fine.

- Now it's time to go back to the `moviesRouter.js` file and put in the logic to return all the movies.

  ```js
  moviesRouter.get("/", async (req, res) => {
    // Call on the correct Movie method and
    // Return all the movies here
  })
  ```

- Make use of the `Movie` model and fill out the `findAll()` and `findById()` functions, so that you can more easily query the database for these records.

- If the movies are being returned in the correct format, they should be viewable by navigating to <http://localhost:3000/api/v1/movies> and seeing the JSON object being returned. You can also navigate to <http://localhost:3000/movies> and see the information displayed in a list.

- After you get the `/api/v1/movies` endpoint working, it's on to fixing `/api/v1/movies/#:id`!

### Tips

- Jump into `psql` to check that your insert statements and queries are set up correctly.

- If you are having trouble returning the data in the correct format use a `debugger` to pause execution and take a look at the object you are creating!

- A `debugger` can also be used in the return of the fetch in `MoviesIndex.js` to see that the correct data type is being stored in state. If the front end is expecting an object and we are attempting to store a string in state, it may cause errors depending on the methods being called on this piece of state later in the component

- You will not need to edit any of the React components to get the app working.