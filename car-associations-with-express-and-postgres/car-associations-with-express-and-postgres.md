We now know how to associate our database tables and models so that we can query for associated data. Let's apply that process to an application using car makes and models!

### Getting Started

```sh
et get car-associations-with-express-and-postgres
cd car-associations-with-express-and-postgres
createdb car_associations_development
yarn install
yarn run dev
```

In a second tab:

```sh
yarn run dev:client
```

You've been provided with a `schema.sql` and model for `CarMake`s. Right now, your React frontend is built out to have a show page for each `CarMake` at the path "/car-makes/:id". However, these components expect the endpoint to have a `CarMake` object with nested `carModels` underneath it, as so:

```js
{
  carMake: {
    name: "Toyota",
    ...
    carModels: [
      {
        name: "Camry",
        ...
      },
      {
        name: "Prius",
        ...
      }
    ]
  }
}
```

Follow the below instructions to get your React frontend functioning properly!

1. Update your `server/db/schema.sql` file to include a `car_models` table (believe me, you'll be glad when our model is called `CarModel` instead of `Model`). The `car_models` table should have an "id" primary key, a "name" column which holds a required string, and a foreign key column for the `car_make_id`.

Run the below to import your schema:
```sh
psql car_associations_development
\i server/db/schema.sql
\q
```

2. Create a `CarModel` model with core functionality of a `constructor`, `findAll`, and `findById` methods. Be sure to handle for both `car_make_id` and `carMakeId` for your foreign key!

3. Add the appropriate association methods to both your `CarMake` and `CarModel` models. This should represent a one-to-many relationship where one `CarMake` has many `CarModel`s.

4. Run the provided Seeder file by running the following command:
```sh
yarn run db:seed
```

5. Once your association methods are set up, update the endpoint provided in your `carMakesRouter` to nest the related `carModels` as an attribute of the selected `carMake`. If you're running into errors, be careful to review which words you've pluralized or kept singular!

6. Once your work is done, visit <http://localhost:3000/car-makes/1> to see if your car make and its related models are showing up properly!