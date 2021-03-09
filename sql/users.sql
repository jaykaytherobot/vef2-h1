-- Users tafla --
DROP TABLE IF EXISTS users;

CREATE TABLE IF NOT EXISTS users(
  id serial primary key, 
  name varchar(128) not null unique, 
  password varchar(128) not null,
  admin boolean not null default false
);