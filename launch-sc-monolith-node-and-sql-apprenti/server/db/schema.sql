-- DROP TABLE IF EXISTS adventures;
-- CREATE TABLE adventures (
--   id SERIAL PRIMARY KEY,
--   title VARCHAR(255) NOT NULL,
--   location VARCHAR(255) NOT NULL
-- );
DROP TABLE IF EXISTS locations;
CREATE TABLE locations (
  location VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255)
);
INSERT INTO locations(location, name)
VALUES ('Spain', 'Spain'),
  ('Grand Canyon', 'Grand Canyon'),
  ('Hawaii', 'Hawaii'),
  ('Outer Rim', 'Outer Rim'),
  ('Studio 42 Florida', 'Studio 42 Florida'),
  (
    'The Collective Unconscious',
    'The Collective Unconscious'
  ),
  ('Everywhen', 'Everywhen');
DROP TABLE IF EXISTS adventures;
CREATE TABLE adventures (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  location VARCHAR(255) REFERENCES locations(location)
);