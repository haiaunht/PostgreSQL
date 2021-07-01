CREATE TABLE car_makes (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL
);
CREATE TABLE car_models (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  car_make_id INTEGER REFERENCES car_makes(id)
);