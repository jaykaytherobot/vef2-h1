CREATE TABLE IF NOT EXISTS Shows {
    id serial PRIMARY KEY,
    name varchar(128) NOT NULL,
    airDate timestamp NOT NULL,
    inProduction boolean, 
    tagline varchar(128),
    img varchar(256) NOT NULL,
    desc text,
    lang varchar(5),
    network varchar(128) NOT NULL,
    website varchar(256)
};

CREATE TABLE IF NOT EXISTS Genre {
    id serial PRIMARY KEY,
    name varchar(128) NOT NULL
};

CREATE TABLE IF NOT EXISTS ShowToGenre {
    id serial PRIMARY KEY,
    showID varchar(128),
    genreID varchar(128),
    FOREIGN KEY (showID) REFERENCES Shows(id),
    FOREIGN KEY (genreID) REFERENCES Genre(id)
};

CREATE TABLE IF NOT EXISTS Season {
    id serial PRIMARY KEY,
    showID varchar(128),
    name varchar(128) NOT NULL,
    num integer,
    CHECK(number > 0),
    airDate timestamp, 
    desc text,
    poster varchar(256) NOT NULL,
    FOREIGN KEY (showID) REFERENCES Shows(id)
};

CREATE TABLE IF NOT EXISTS Episodes {
    id serial PRIMARY KEY,
    seasonID varchar(128),
    name varchar(128) NOT NULL,
    num integer,
    CHECK(num > 0),
    airDate timestamp,
    desc text,
    FOREIGN KEY (seasonID) REFERENCES Season(id)
};

CREATE TABLE IF NOT EXISTS Users {
    id serial PRIMARY KEY,
    name varchar(128) NOT NULL,
    email varchar(128) NOT NULL,
    password varchar(128) NOT NULL,
    admin boolean DEFAULT FALSE
};

CREATE TABLE IF NOT EXISTS EpisodeToUser {
    episodeID varchar(128),
    userID varchar(128),
    status varchar(128),
    grade integer,
    FOREIGN KEY (episodeID) REFERENCES Episodes(id),
    FOREIGN KEY (userID) REFERENCES Users(id)
};