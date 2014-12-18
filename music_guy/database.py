#!/usr/bin/env python3

import sqlite3
import os
import time
import threading
import logging

CREATE_TABLE = "".join(open('setupdb.sql', 'r').readlines())
GET_MODIFIED = """SELECT modified_time FROM songs WHERE filepath = ?"""
ADD_SONG = """INSERT OR REPLACE INTO songs
              (filepath, modified_time)
              VALUES (?,?)"""
SWAP_FILEPATH = """UPDATE songs SET filepath=? WHERE filepath=?"""
SEARCH = r"""SELECT * FROM songs WHERE lower(songs.filepath) LIKE lower(?)"""

logger = logging.getLogger(__name__)

class Database(object):
    """Class for wrapping the sqlite3 database.
    """
    def __init__(self, dbpath):
        self.connections = {}
        self.dbpath = dbpath
        conn = sqlite3.connect(self.dbpath)
        c = conn.cursor()
        c.executescript(CREATE_TABLE)
        conn.commit()
        logger.debug('Database ready.')

    def add(self, filepath):
        conn = self.get_connection()
        c = conn.cursor()
        c.execute(ADD_SONG, (filepath, os.stat(filepath).st_mtime))
        conn.commit()
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

    def search(self, term, limit=50):
        conn = self.get_connection()
        c = conn.cursor()
        term = '%' + term + '%'
        c.execute(SEARCH, (term,))
        rows = c.fetchmany(limit)
        for row in rows:
            print(row)

