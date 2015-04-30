
import sqlite3

class Database(object):

    def __init__(self, db_path):
        self.db_path = db_path

    def get_conn(self):
        return sqlite3.connect(db_path)

    def


