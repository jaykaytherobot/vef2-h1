DROP TABLE IF EXISTS ShowToGenre CASCADE;
DROP TABLE IF EXISTS ShowToUser CASCADE;
DROP TABLE IF EXISTS Episodes CASCADE;
DROP TABLE IF EXISTS Seasons CASCADE;
DROP TABLE IF EXISTS Genres CASCADE;
DROP TABLE IF EXISTS Series CASCADE;
DROP TABLE IF EXISTS Users CASCADE;

CREATE TABLE IF NOT EXISTS Series(
    id serial PRIMARY KEY,
    name varchar(128) NOT NULL,
    air_date date NOT NULL,
    in_production boolean,
    tagline varchar(128),
    image varchar(256) NOT NULL,
    description text,
    language varchar(5),
    network varchar(128) NOT NULL,
    url varchar(256)
);

CREATE TABLE IF NOT EXISTS Genres(
    id serial PRIMARY KEY,
    name varchar(128) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS SerieToGenre(
    id serial PRIMARY KEY,
    serieId serial,
    genreId serial,
    FOREIGN KEY (seriesId) REFERENCES Series(id),
    FOREIGN KEY (genreId) REFERENCES Genres(id)
);

CREATE TABLE IF NOT EXISTS Seasons(
    id serial PRIMARY KEY,
    seriesId serial,
    name varchar(128) NOT NULL,
    serieName varchar(128) NOT NULL,
    num integer,
    CHECK(num > 0),
    airDate timestamp,
    overview text,
    poster varchar(256) NOT NULL,
    FOREIGN KEY (seriesId) REFERENCES Series(id)
);

CREATE TABLE IF NOT EXISTS Episodes(
    id serial PRIMARY KEY,
    seriesId integer,
    season integer,
    name varchar(128) NOT NULL,
    num integer,
    CHECK(num > 0),
    -- airDate datetime,
    serie varchar(128),
    overview text,
    FOREIGN KEY (seriesId) REFERENCES Series(id)
);

CREATE TABLE IF NOT EXISTS Users(
    id serial PRIMARY KEY,
    name varchar(128) NOT NULL UNIQUE,
    email varchar(128) NOT NULL UNIQUE,
    password varchar(128) NOT NULL,
    admin boolean DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS SerieToUser(
    seriesId serial,
    userId serial,
    status varchar(128),
    grade integer,
    FOREIGN KEY (seriesId) REFERENCES Series(id),
    FOREIGN KEY (userId) REFERENCES Users(id)
);
