DROP TABLE IF EXISTS ShowToGenre;
DROP TABLE IF EXISTS EpisodeToUser;
DROP TABLE IF EXISTS Episodes;
DROP TABLE IF EXISTS Season;
DROP TABLE IF EXISTS Genre;
DROP TABLE IF EXISTS Shows;
DROP TABLE IF EXISTS Users;

CREATE TABLE IF NOT EXISTS Shows(
    id serial PRIMARY KEY,
    name varchar(128) NOT NULL,
    airDate timestamp NOT NULL,
    inProduction boolean, 
    tagline varchar(128),
    img varchar(256) NOT NULL,
    description text,
    lang varchar(5),
    network varchar(128) NOT NULL,
    website varchar(256)
);

CREATE TABLE IF NOT EXISTS Genre(
    id serial PRIMARY KEY,
    name varchar(128) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS ShowToGenre(
    id serial PRIMARY KEY,
    showID serial,
    genreID serial,
    FOREIGN KEY (showID) REFERENCES Shows(id),
    FOREIGN KEY (genreID) REFERENCES Genre(id)
);

CREATE TABLE IF NOT EXISTS Season(
    id serial PRIMARY KEY,
    showID serial,
    name varchar(128) NOT NULL,
    serieName varchar(128) NOT NULL,
    num integer,
    CHECK(num > 0),
    airDate timestamp, 
    description text,
    poster varchar(256) NOT NULL,
    FOREIGN KEY (showID) REFERENCES Shows(id)
);

CREATE TABLE IF NOT EXISTS Episodes(
    id serial PRIMARY KEY,
    seasonID serial,
    name varchar(128) NOT NULL,
    num integer,
    CHECK(num > 0),
    airDate timestamp,
    description text,
    FOREIGN KEY (seasonID) REFERENCES Season(id)
);

CREATE TABLE IF NOT EXISTS Users(
    id serial PRIMARY KEY,
    name varchar(128) NOT NULL,
    email varchar(128) NOT NULL,
    password varchar(128) NOT NULL,
    admin boolean DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS EpisodeToUser(
    episodeID serial,
    userID serial,
    status varchar(128),
    grade integer,
    FOREIGN KEY (episodeID) REFERENCES Episodes(id),
    FOREIGN KEY (userID) REFERENCES Users(id)
);