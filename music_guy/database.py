#!/usr/bin/env python3

import collections
import sqlite3
import os
import time
import threading
import logging

from music_guy.media import Song

CREATE_TABLE = "".join(open('music_guy/setupdb.sql', 'r').readlines())
GET_MODIFIED = """
SELECT
    modified_time
FROM
    songs
WHERE
    filepath = ?"""

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

def dict_factory(cursor, row):
    d = {}
    for idx, col in enumerate(cursor.description):
        d[col[0]] = row[idx]
    return d

def sql_columns(columns):
    parts = []
    parts.append('(')
    parts.append(', '.join(columns))
    parts.append(') ')
    return "".join(parts)

class Table(object):
    """Represents a table in the database.  Table objects know their name,
    and their columns.
    """

    def __init__(self, name, columns):
        self.name = name
        self.columns = columns

class Query(object):
    """Base class for queries.  Defines the behavior needed to execute
    a query using the `*` operator.
    """
    def string(self):
        pass

    def values(self):
        pass

    def __getitem__(self, key):
        if key == 0:
            return self.string()
        elif key ==1:
            return self.values()
        else:
            raise IndexError


class InsertReplaceQuery(Query):

    def __init__(self, table, item):
        super().__init__()
        self.columns = tuple(table.columns)
        self._item = item
        self.commit = True
        self._parts = []
        self._parts.append("""INSERT OR REPLACE INTO %s """ % table.name)
        self._add_fields()
        self._add_values()

    def _add_fields(self):
        self._parts.append('(')
        self._parts.append(', '.join(self.columns))
        self._parts.append(') ')

    def _add_values(self):
        self._parts.append('VALUES (')
        for _ in range(len(self.columns) - 1):
            self._parts.append('?, ')
        self._parts.append('?) ')

    def string(self):
        return "".join(self._parts)

    def values(self):
        values = []
        for column in self.columns:
            try:
                values.append(self._item[column])
            except KeyError:
                values.append(None)
        return tuple(values)


class Database(object):
    """Class for wrapping the sqlite3 database.
    """
    def __init__(self, dbpath):
        self.connections = {}
        self.dbpath = dbpath
        with  self.get_connection() as conn:
            conn.executescript(CREATE_TABLE)
            info = conn.execute('PRAGMA table_info(songs)').fetchall()
            columns = [x[1] for x in info]
        self.songs = Table('songs', columns)    

        logger.debug('Database ready.')

    def add_file(self, filepath):
        song = Song(filepath)
        self.add_song(song)

    def add_song(self, song):
        query = InsertReplaceQuery(self.songs, song)
        self.execute(query)

    def check(self, filepath):
        conn = self.get_connection()
        c = conn.cursor()
        c.execute(GET_MODIFIED, (filepath,))
        rows = c.fetchall()
        if len(rows) == 0:
            self.add_file(filepath)
            return True
        elif len(rows) > 1:
            debug.critical('Multiple entries for filepath %s' % filepath)
        elif rows[0][0] < os.stat(filepath).st_mtime:
            self.add_file(filepath)
            return True
        else:
            return False

    def get_connection(self):
        """Method to ensure each thread is using it's own connection
        """
        thread = threading.current_thread()
        try:
            connection =  self.connections[thread]
        except KeyError:
            logger.debug('New connection created for %s', thread)
            self.connections[thread] = sqlite3.connect(self.dbpath)
            connection = self.connections[thread]
            #connection.row_factory = sqlite3.Row
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
        c.execute("""UPDATE songs SET filepath=? WHERE filepath=?""", (filepath_dest, filepath_src))
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
        results = self.execute(('SELECT * FROM songs',))
        return results

    def execute(self, query, commit=False):
        try:
            commit = query.commit 
        except AttributeError:
            pass
        conn = self.get_connection()
        conn.row_factory = dict_factory
        c = conn.execute(*query)
        if commit:
            conn.commit()
        else:
            return c.fetchall()

    def get_song(self, songID):
        query = ("SELECT * FROM songs WHERE songid == ?", (songID,))
        results = self.execute(query)
        return results[0]
