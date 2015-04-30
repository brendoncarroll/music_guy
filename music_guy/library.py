#!/usr/bin/env python3

import os

from pymongo import MongoClient
from music_guy import DATABASE_FILEPATH

from music_guy.media import make_mediafile

class Library(object):

    def __init__(self):
        self.client = MongoClient()
        self.db = client.music_guy

        self.mediafiles = db.mediafiles
        self.mediafiles.create_index()

    def add_mediafile(self, mediafile):
        """Adds a file to the Library
        """
        mf_dict = mediafile.as_dict()
        self.mediafiles.insert(mf_dict)

    def check(self, filepath):
        mf_dict = self.mediafiles.find_one({'path': filepath})
        mtime = os.stat(filepath).st_mtime
        if mf_dict['mtime'] < mtime:
            self.add_mediafile(make_mediafile(filepath))
            return True # Needed update
        else:
            return False # Didn't need update


    def mark_missing(self):
        pass

    def search(self, param):
        if q in param:
            pass
        else:
            pass

    def get_song(self, songID, offset):
        """Returns a lightweight representation of a song as a
        dict.
        """
        self.mediafiles.find_one()


    def swap_filepath(self, src_path, dst_path):
        pass


    def get_songs(self, limit=100):
        pass


if __name__ == '__main__':
    pass
