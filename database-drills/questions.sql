----------------------------
-------- RETRIEVAL ---------
----------------------------
-- 
-- What titles were released in 2003? (151 counts)
--
SELECT movies.title AS Title
FROM movies
WHERE year = 2003;
--
-- What titles were released in 2004 and had a rating higher than 90? (16 counts)
--
SELECT movies.title AS Title
FROM movies
WHERE year = 2004
  AND rating > 90;
--
-- What actors have the last name of Wilson?( 124 counts)
--
SELECT actors.name
FROM actors
WHERE actors.name LIKE '% Wilson';
--
-- What actors have the first name of Owen? (19 counts)
--
SELECT actors.name
FROM actors
WHERE actors.name LIKE 'Owen %';
--
-- What studios start with "Fox"? (6 counts)
--
SELECT studios.name AS Fox_studio
FROM studios
WHERE studios.name LIKE 'Fox%';
--
-- What studios involve Disney? (11 counts)
--
SELECT studios.name AS Fox_studio
FROM studios
WHERE studios.name LIKE '%Disney%';
--
-- What were the top 5 rated movies in 2005? (5 counts)
--
SELECT movies.title,
  movies.rating
FROM movies
WHERE year = 2005
  AND rating IS NOT NULL
ORDER BY rating DESC
LIMIT 5;
--
-- What were the worst 10 movie titles and their ratings in 2000? (10 counts)
--
SELECT movies.title,
  movies.rating
FROM movies
WHERE year = 2000
  AND rating IS NOT NULL
ORDER BY rating
LIMIT 10;
----------------------------
---- ADVANCED RETRIEVAL-----
----------------------------
--
-- What movie titles were produced by Walt Disney Pictures in 2010? (7 counts)
--
SELECT movies.title AS Movie,
  movies.year,
  studios.name AS Studio
FROM movies
  JOIN studios ON (movies.studio_id = studios.id)
WHERE movies.year = 2010
  AND studios.name = 'Walt Disney Pictures';
--
-- Who were the characters in "The Hunger Games"? (45 counts)
--
SELECT movies.title AS Movie,
  cast_members.character
FROM movies
  JOIN cast_members ON (movies.id = cast_members.movie_id)
WHERE title = 'The Hunger Games'
  AND character IS NOT NULL;
--
-- Who acted in "The Hunger Games"? (45 counts)
--
SELECT movies.title AS Movie,
  actors.name
FROM movies
  JOIN cast_members ON (movies.id = cast_members.movie_id) -- can do like
  -- FROM movies AS m JOIN cast_members AS cm ON (m.id = cm.movie_id)
  JOIN actors ON (actors.id = cast_members.actor_id)
WHERE title = 'The Hunger Games'
  AND character IS NOT NULL;
--
-- Who acted in a Star Wars movie? Be sure to include all movies.(264 counts)
--
SELECT movies.title AS Movie,
  actors.name AS Cast
FROM movies
  JOIN cast_members ON (movies.id = cast_members.movie_id)
  JOIN actors ON actors.id = cast_members.actor_id
WHERE movies.title LIKE '%Star Wars%';
--
-- What were all of the character names for movies released in 2009? (4151 counts)
--
SELECT cast_members.character AS All_Character_2009
FROM movies
  JOIN cast_members ON (movies.id = cast_members.movie_id)
WHERE year = 2009;
--
-- What are the character names in the "The Dark Knight Rises"? (22 counts)
--
SELECT cast_members.character
FROM movies
  JOIN cast_members ON (movies.id = cast_members.movie_id)
WHERE title = 'The Dark Knight Rises';
--
-- What actors and actresses have been hired by Buena Vista? (1663 counts)
-- 
SELECT studios.name AS Studio,
  actors.name AS Actors_Actresses
FROM studios
  JOIN movies ON (studios.id = movies.studio_id)
  JOIN cast_members ON (movies.id = cast_members.movie_id)
  JOIN actors ON (cast_members.actor_id = actors.id)
WHERE studios.name = 'Buena Vista';
--------------------------
-------- UPDATING --------
--------------------------
-- update Troll 2 to have rating = 500 (update 1)
UPDATE movies
SET rating = 500
WHERE title = 'Troll 2';
--
-- Update Police ...4 to 20 (update 1)
UPDATE movies
SET rating = 20
WHERE title LIKE 'Police%4%Patrol';
--
- -
update Matt->The artist...Damom (
    update 1
  )
UPDATE actors
SET name = 'The Artist Formerly Known as Matt Damon'
WHERE name = 'Matt Damon';
--------------------------
-------- DELETION --------
--------------------------
--
-- Delete Back to the Future p-III
-- Delete correlating cast_members in this movies first (49 counts)
DELETE FROM cast_members
WHERE movie_id IN (
    SELECT id
    FROM movies
    WHERE title = 'Back to the Future Part III'
  );
-- now deleting the movie (1 count)
DELETE FROM movies
WHERE title = 'Back to the Future Part III';
--
-- Delete all horror movies
-- deleting all cast members (DELETED 2544 counts)
DELETE FROM cast_members
WHERE movie_id IN (
    SELECT movies.id
    FROM movies
      JOIN genres ON (movies.genre_id = genres.id)
    WHERE genres.name = 'Horror'
  );
-- now deleting the horror movies (DELETED 115 counts)
DELETE FROM movies
WHERE movies.id IN (
    SELECT movies.id
    FROM movies
      JOIN genres ON (movies.genre_id = genres.id)
    WHERE genres.name = 'Horror'
  );
--
-- Delete all cast members in same movies with BenAffleck  (26)
DELETE FROM movies
WHERE movies.id IN (
    SELECT cast_members.movie_id
    FROM cast_members
      JOIN actors ON (cast_members.actor_id = actors.id)
    WHERE actors.name = 'Ben Affleck'
  );
--
-- Delete any movie '20th Century Fox' produced that has a rating of less than 80.
DELETE FROM movies
WHERE id IN (
    SELECT movies.id
    FROM movies
      JOIN studios ON (movies.studio_id = studios.id)
    WHERE movies.rating < 80
      AND studios.name = '20th Century Fox'
  );
--------------------------
--------- SCHEMA ---------
--------------------------
--
-- create reviews table
CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  description VARCHAR(255),
  score INTEGER,
  author_name VARCHAR(255),
  movie_id INTEGER REFERENCES movies(id)
);
-- 
-- create crimes table
CREATE TABLE crimes (
  id SERIAL PRIMARY KEY,
  actor_id INTEGER REFERENCES actors(id),
  year_of_offense INTEGER,
  title_of_offense VARCHAR(255)
);