-- Sets up the songs table
CREATE TABLE IF NOT EXISTS songs
(ID INTEGER PRIMARY KEY,
filepath TEXT NOT NULL,
modified_time REAL,
albumartist TEXT,
album TEXT,
artist TEXT,
title TEXT,
UNIQUE (filepath));