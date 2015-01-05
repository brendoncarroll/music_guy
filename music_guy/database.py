#!/usr/bin/env python3

import collections
import sqlite3
import os
import time
import threading
import logging

import music_guy.media as media

CREATE_TABLE = "".join(open('music_guy/setupdb.sql', 'r').readlines())
GET_MODIFIED = """
SELECT
    modified_time
FROM
    songs
WHERE
    filepath = ?"""

ADD_SONG = """
INSERT OR REPLACE INTO
    songs
    (filepath, modified_time, albumartist, album, artist, title)
VALUES
    (?,?,?,?,?,?)"""

SWAP_FILEPATH = """
UPDATE 
    songs 
SET
    filepath=?
WHERE
    filepath=?"""

SEARCH = """
SELECT
    *
FROM
    songs
WHERE
    upper(songs.albumartist) LIKE upper(?) OR
    upper(songs.album) LIKE upper(?) OR
    upper(songs.artist) LIKE upper(?) OR
    upper(songs.title) LIKE upper(?)"""

logger = logging.getLogger(__name__)

class Database(object):
    """Class for wrapping the sqlite3 database.
    """
    def __init__(self, dbpath):
        self.connections = {}
        self.dbpath = dbpath
        self.execute(CREATE_TABLE, commit=True)
        logger.debug('Database ready.')

    def add(self, filepath):
        song = media.make_song(filepath)
        print(song)
        self.execute(ADD_SONG, song, commit=True)
        logger.debug('Update: %s' % filepath)

    def check(self, filepath):
        conn = self.get_connection()
        c = conn.cursor()
        c.execute(GET_MODIFIED, (filepath,))
        rows = c.fetchall()
        if len(rows) == 0:
            self.add(filepath)
            return True
        elif len(rows) > 1:
            debug.critical('Multiple entries for filepath %s' % filepath)
        elif rows[0][0] < os.stat(filepath).st_mtime:
            self.add(filepath)
            return True
        else:
            return False

    def get_connection(self):
        """Method to ensure each thread is using it's own connection
        """
        thread = threading.current_thread()
        try:
            return self.connections[thread]
        except KeyError:
            logger.debug('New connection created for %s', thread)
            self.connections[thread] = sqlite3.connect(self.dbpath)
        return self.connections[thread]

    def done(self):
        """If there is a connection for your thread and you call it, this
        will close it, but not commit any changes.
        """
        try:
            del self.connections[threading.current_thread()]
            return True
        except KeyError:
            return False

    def mark_missing(self, filepath):
        pass

    def swap_filepath(self, filepath_src, filepath_dest):
        conn = self.get_connection()
        c = conn.cursor()
        c.execute(SWAP_FILEPATH, (filepath_dest, filepath_src))
        conn.commit()

    def search(self, query, limit=20):
        """This could probably be simplified, or moved into SQL.  It searches
        to see if each word in `query` is in any of the columns and returns
        that column.  It counts the amount of times a column is returned and
        then returns the columns sorted by the number of times they appear.
        """
        conn = self.get_connection()
        c = conn.cursor()
        terms = query.split()
        rows = collections.Counter()
        for term in terms:
            term = '%' + term + '%'
            c.execute(SEARCH, (term, term, term, term))
            rows.update(c.fetchall())
        songs = []
        for row in rows.most_common(limit):
            song = media.Song(*row[0])._asdict()
            songs.append(song)
        return songs

    def get_all(self, limit=100):
        c = self.execute("SELECT * FROM songs")
        rows = c.fetchmany(limit)
        songs = []
        for row in rows:
            song = media.Song(*row)._asdict()
            songs.append(song)
        return songs

    def execute(self, query, param=tuple(), commit=False):
        """Creates a cursor, runs its execute method, commits if necessary,
        and returns the cursor.
        """
        conn = self.get_connection()
        c = conn.cursor()
        c.execute(query, param)
        if commit:
            conn.commit()
        return c


