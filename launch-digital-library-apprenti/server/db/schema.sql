-- DROP TABLE books IF EXIST
CREATE TABLE books (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(255) NOT NULL,
  pageCount INTEGER NOT NULL,
  description TEXT,
  fiction boolean
);
CREATE TABLE notes (
  id SERIAL PRIMARY KEY,
  date DATE,
  title VARCHAR(255),
  body TEXT,
  book_id INTEGER REFERENCES books(id)
);
-- saving insert statement
-- INSERT INTO books(title, author, pageCount, description, fiction)
-- VALUES (
--     'The secret history of the Mongol Queens',
--     'Jack Weatherford',
--     336,
--     'Great book of the thrteenth century ruled the largest empire the world has ever known',
--     false
--   ),
--   (
--     'Ready Player One',
--     'Ernest Cline',
--     374,
--     'Good book',
--     true
--   );