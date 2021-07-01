-- Your code here
create table movies (
  id serial primary key,
  title varchar(255) not null,
  genre varchar(255) not null,
  description varchar(255)
);
insert into movies (title, genre, description)
values ('To all the Boys', 'comedy', 'teen'),
  ('Raya', 'cartoon', 'Disney movies'),
  ('Fast and Furious', 'action', 'really good');