#!/usr/bin/env python

import collections
import os

from mutagen.flac import FLAC

# This makes a class which extends the built in `tuple` class.  It is useful
# for putting stuff SQL queries.
# The most obvious problem with this is that it will become out of sync with
# order of fields in the SQL query string.

FIELDS = ['filepath',
          'modified_time',
          'albumartist',
          'album',
          'artist',
          'title']
Song = collections.namedtuple('Song', field_names=FIELDS)

def make_song(filepath):
    song = FLAC(filepath)
    return Song(filepath=filepath,
                modified_time=os.stat(filepath).st_mtime,
                albumartist=song['albumartist'][0],
                album=song['album'][0],
                artist=song['artist'][0],
                title=song['title'][0]
                )
