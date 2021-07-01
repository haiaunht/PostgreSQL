### Getting Started

```no-highlight
et get discographies
cd discographies
createdb discography
```

If your database ever gets corrupted and you'd like to start over, you can:

```no-highlight
dropdb discography
createdb discography
```

Before we can start working in an SQL database we first have to build it!
Consider a database to store information about various bands' discographies. What information would we need to store? How would we want to structure the database? What do we do about One Hit Wonders?

Create a `schema.sql` which satisfies the following critera.
  - All tables must have a unique `id` field as their primary key.
  - Assume that all fields are required unless noted otherwise.
  - The schema should be rerunnable as it grows over time

```no-highlight
As a database user
I want to be able to retrieve information about bands
So I can better know their work
```
### Acceptance Criteria

* There is a bands table with the following information:
  - band_name - varchar
  - year_formed - integer
  - history - text -optional

```no-highlight
As a database user
I want to be able to retrieve information about albums
So I can dive deeper into different eras of music

```

### Acceptance Criteria

* There is an albums table with the following information:
  - album_name - varchar
  - release_year - integer
  - label - varchar -optional
  - liner_notes - text - optional
  - artist_id - foreign_key

### Acceptance Criteria

```no-highlight
As a database user
I want to have data to work with
So I can ensure this is all working
```

### Acceptance Criteria

**This should be done in a seperate file from your schema**
* Write insert statements for at least 2 bands
* Write insert statements for at least 2 albums per band

### Acceptance Criteria

```no-highlight
As a database user
I need lists of songs
So I can yell them at the band when I see them live
```

* Create a songs table with the following information
  - band - foreign_key
  - album - foreign_key
  - title - varchar
  - single - boolean (true if the song was released as a single, false if not)

```no-highlight
As a database user
I need lists of songs in the actual DB
So I can yell them at the band when I see them live
```

### Acceptance Criteria

  * Write insert statements for at least two songs per artist.
  * Write a query in your `queries.sql` file to return a list of all of your bands, their albums, and the songs associated with the albums.
