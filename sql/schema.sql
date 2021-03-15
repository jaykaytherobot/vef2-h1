DROP TABLE IF EXISTS ShowToGenre CASCADE;
DROP TABLE IF EXISTS ShowToUser CASCADE;
DROP TABLE IF EXISTS Episodes CASCADE;
DROP TABLE IF EXISTS Seasons CASCADE;
DROP TABLE IF EXISTS Genres CASCADE;
DROP TABLE IF EXISTS Shows CASCADE;
DROP TABLE IF EXISTS Users CASCADE;

CREATE TABLE IF NOT EXISTS Shows(
    id serial PRIMARY KEY,
    name varchar(128) NOT NULL,
    airDate date NOT NULL,
    inProduction boolean,
    tagline varchar(128),
    img varchar(256) NOT NULL,
    description text,
    lang varchar(5),
    network varchar(128) NOT NULL,
    website varchar(256)
);

CREATE TABLE IF NOT EXISTS Genres(
    id serial PRIMARY KEY,
    name varchar(128) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS ShowToGenre(
    id serial PRIMARY KEY,
    showId serial,
    genreId serial,
    FOREIGN KEY (showId) REFERENCES Shows(id),
    FOREIGN KEY (genreId) REFERENCES Genres(id)
);

CREATE TABLE IF NOT EXISTS Seasons(
    id serial PRIMARY KEY,
    showId serial,
    name varchar(128) NOT NULL,
    serieName varchar(128) NOT NULL,
    num integer,
    CHECK(num > 0),
    airDate datetime,
    overview text,
    poster varchar(256) NOT NULL,
    FOREIGN KEY (showId) REFERENCES Shows(id)
);

CREATE TABLE IF NOT EXISTS Episodes(
    id serial PRIMARY KEY,
    showId integer,
    season integer,
    name varchar(128) NOT NULL,
    num integer,
    CHECK(num > 0),
    -- airDate datetime,
    serie varchar(128),
    overview text,
    FOREIGN KEY (showId) REFERENCES Shows(id)
);

CREATE TABLE IF NOT EXISTS Users(
    id serial PRIMARY KEY,
    name varchar(128) NOT NULL,
    email varchar(128) NOT NULL,
    password varchar(128) NOT NULL,
    admin boolean DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS ShowToUser(
    showId serial,
    userId serial,
    status varchar(128),
    grade integer,
    FOREIGN KEY (showId) REFERENCES Shows(id),
    FOREIGN KEY (userId) REFERENCES Users(id)
);
