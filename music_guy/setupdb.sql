-- Sets up the songs table
CREATE TABLE IF NOT EXISTS songs
(filepath TEXT(4096) NOT NULL,
modified_time REAL,
UNIQUE (filepath));