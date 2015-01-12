-- Clear db for dev purposes
DROP TABLE IF EXISTS songs;
DROP TABLE IF EXISTS artists;


-- Sets up the songs table
CREATE TABLE IF NOT EXISTS songs
(songID INTEGER PRIMARY KEY,
filepath TEXT NOT NULL,
modified_time REAL,
albumartist TEXT,
album TEXT,
artist TEXT,
title TEXT,
genre TEXT,
UNIQUE (filepath));


--Sets up the artists table
CREATE TABLE IF NOT EXISTS artists
(artistID INTEGER PRIMARY KEY,
name TEXT NOT NULL,
total_songs INTEGER DEFAULT 0,
UNIQUE (name));
