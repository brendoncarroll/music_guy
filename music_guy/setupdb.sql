-- Clear db for dev purposes
--DROP TABLE IF EXISTS songs;
--DROP TABLE IF EXISTS artists;


-- Sets up the songs table
CREATE TABLE IF NOT EXISTS songs (
	songID INTEGER PRIMARY KEY,
	filepath TEXT NOT NULL,
	mtime REAL,
	UNIQUE (filepath)
);

CREATE TABLE IF NOT EXISTS titles (
	songID INTEGER REFERENCES songs(songID)
);

--Sets up the artists table
CREATE TABLE IF NOT EXISTS artists (
	songID INTEGER REFERENCES songs(songID)
	artist TEXT,
);

CREATE TABLE IF NOT EXISTS genres(
	songID INTEGER REFERENCES songs(songID),
	genre TEXT
);
