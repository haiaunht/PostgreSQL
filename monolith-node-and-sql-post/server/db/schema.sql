DROP TABLE IF EXISTS quotes;

CREATE TABLE quotes (
  id SERIAL PRIMARY KEY,
  quote TEXT,
  author VARCHAR(255),
  subject VARCHAR(255)
);
