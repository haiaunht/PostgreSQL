
CREATE TABLE bands (
  id SERIAL PRIMARY KEY,
  band_name VARCHAR(255),
  year_formed INTEGER
);

CREATE TABLE albums (
  id SERIAL PRIMARY KEY,
  album_name VARCHAR(255),
  release_year INTEGER,
  label VARCHAR(255),
  liner_notes VARCHAR(255),
  band_id INTEGER REFERENCES bands(id)
);

CREATE TABLE songs (
  id serial primary key,
  band_id integer references bands(id),
  album_id integer references albums(id),
  title varchar(255),
  single boolean
);


-- insert into bands
INSERT INTO bands(band_name, year_formed)
VALUES ('Michael Learns to Rock', 1988),
       ('Abba', 1972);

-- insert into albums 
INSERT INTO albums(
    album_name,
    release_year,
    label,
    liner_notes,
    band_id
  )
VALUES ('Ring Ring', 1973, 'Polar', null, 2),
  ('ABBA', 1975, 'Polar', null, 2),
  ('International breakthrough', 1993,'EMI Records', null, 1),
  ('The beginnings', 1992, 'EMI Records', null, 1);

-- inset into songs
INSERT INTO songs(band_id, album_id, title, single)
VALUES (1, 1, 'Sleeping Child', true),
      (1, 1, '25 Minutes', true),
      (2, 1, 'Ring Ring', true),
      (2, 1, 'People need Love', false),
      (2, 2, 'Mamma Mia', true);
