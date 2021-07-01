
-- list bands and their albums
SELECT bands.band_name AS Band,
       albums.album_name AS Album,
       songs.title AS Song
FROM bands
  JOIN albums ON (bands.id = albums.band_id)
  JOIN songs ON (bands.id = songs.band_id);