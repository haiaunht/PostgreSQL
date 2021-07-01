We're going to build an app to fuel our wanderlust! Welcome to your Adventure-Planning app. Be sure to take a look around at the provided code before diving into the user stories below.

## Getting Started

```sh
et get launch-sc-monolith-node-and-sql-apprenti
cd launch-sc-monolith-node-and-sql-apprenti
yarn install
createdb monolith_adventures_development
yarn run dev
```

And in a second terminal:

```sh
yarn run dev:client
```

## Instructions

### Meets Expectations

Your React front-end has been built out for you -- you should not need to change any of that code in order to Meet Expectations. Review the provided code and then update the backend server to fulfill the following user stories.

You have been provided with a Schema to import for your starting database structure, and a Seeder to run for some starting data.

#### List Adventures

```no-highlight
As a person with wanderlust
I want to see a list of all of my planned adventures
So that I may be filled with excitement for my coming travels
```

Implementation Details:

- When the `AdventuresList` component fetches to `/api/v1/adventures`, it should receive the existing adventures from the database and render them to the page.
- Add the necessary API endpoint inside of the `adventuresRouter` for a GET request to `/api/v1/adventures`. Set up your endpoint such that the existing React code is able to successfully render the adventures to the page.

Acceptance Criteria:

Once you have implemented the above:

- When navigating to <http://localhost:3000/adventures>, there should be a header on the page, followed by a list of all adventures in the database
- A link at the bottom of the page should bring the user to a (as yet non-functional) new adventure form page


#### See Adventure Details

```no-highlight
As a person who craves adventure
I want to see the details of a particular trip
So that I may prepare for my journey!
```

Acceptance Criteria:

- When navigatingt to <http://localhost:3000/adventure/:id>, there should be the title of the adventure as a header, and the location underneath.

Implementation Details:

- Set up an endpoint to handle requests to `api/v1/adventure/:id`
- Use the id to retreive the specific record from the database and return it to the client

#### Create an Adventure

```no-highlight
As a person seeking adventure
I want to be able to add a new adventure to my list
So that I can bring my dreams of travel to reality
```

Acceptance Criteria:

- When navigating to <http://localhost:3000/adventures/new>, there should be a form on the page to add a new adventure
- When I fill in the information, the form should submit successfully, redirect me back to the index page, and I should see my new adventure in the list

Implementation Details:

- When the form is submitted and a POST fetch is sent to `/api/v1/adventures`, the new adventure should either be persisted and returned, or errors should be returned.
- Add the proper API endpoint for a POST request to `/api/v1/adventures`. Persist the adventure to the database and return the new adventure record to the front end.

As always, `et submit` once you are done with Meets Expectations.

### Exceeds Expectations

#### Abstract Locations

```no-highlight
As an aspiring adventurer
I want to see all of the adventures in a given location
So that I can decide where to galivant to next!
```

Acceptance Criteria:
- When navigating to <http://localhost:3000/locations/:id> I see a list of all adventures associated with that location

Implementation Details:
- Update your schema so that locations are on their own table and that adventures relate to the locations via a foreign key
- Update your models and routes to ensure that existing functionality continues to work
- Update React and Express to build a Location Show Page which displays the location name as a header and a list of adventures associated with it in a List
