We've provided a monolith application for tracking your favorite Concert Venues. Let's set up functionality such that we can save our concert venues of choice to the database!

### Getting Started

Run the following commands to set up your app:

```no-highlight
et get concert-venues-with-express-and-postgres
cd concert-venues-with-express-and-postgres
yarn install
createdb concert_venues_development
```

```
psql concert_venues_development
\i server/db/schema.sql
\q
```

```
yarn run dev
```

In a second tab or terminal instance:

```
yarn run dev:client
```

### Instructions

As always, be sure to review the code provided to you before getting started! Your application has been built out to have a fully-functional React frontend: a React Router with an index page at "/" and a new concert venue form at "/concert-venues/new". Your Express backend has a `schema` file which builds a "concert-venues" table which has already been migrated per the above, and a matching Model. The model has a `findAll()` method built out for you. There is also a `concertVenuesRouter` namespaced at "/api/v1/concert-venues", but no API endpoints have been set up. Get your app functioning properly by completing the below steps.

#### Core Assignment

##### Part One

If we take a look at the `ConcertVenuesList` component, we will see that it is completing a GET `fetch` request to `/api/v1/concert-venues` to retrieve all concert venues currently in our database. Right now, if we load up <http://localhost:3000> with our JS console open, we will see our page load but a `404 Not Found` error in our console thanks to our `fetch` request.

Set up your GET API endpoint to properly serve up all concert venues to populate our page. Remember that you can navigate directly to <http://localhost:3000/api/v1/concert-venues> to test its functionality!

If you want to test this endpoint with some actual records included, use the provided Seeder to add some records with the `yarn run db:seed` (we have provided one record, feel free to add your favorites!) command, or insert some records using the `psql` command and `INSERT` requests.

##### Part Two

Now that we can see existing concert venues, we want to be able to add new ones. Perusing our `NewConcertVenueForm` shows us that there is a POST fetch being sent to `/api/v1/concert-venues`, but no matching API endpoint. Submitting our form will once again result in a `404 Not Found` error in our JS console.

First, create a `save()` method in your model which saves a newly created `ConcertVenue` object to the database. Then, set up your POST API endpoint to properly persist a new concert venue with the request body sent by our `fetch`. Remember to `await` any calls to your database, and use the `save()` method to retrieve and respond with your new concert venue record!

Once your API endpoint is set up successfully, a submission of your New Favorite Concert Venue form should result in being redirected to the index page, and seeing your new venue on the page.
