#!/usr/bin/env python

import collections
import os

import mutagen

class Song(object):

    def __init__(self, filepath):
        self.d = {'filepath':filepath,
                  'modified_time':os.stat(filepath).st_mtime}
        self._file = mutagen.File(filepath)
        self.tags = self._file.tags
        self.info = self._file.info
        self._stream_fields = ['length', 'sample_rate', 'channels', 'bits_per_sample']


    def __getitem__(self, key):
        if key in self._stream_fields:
            try:
                return self.info.__getattribute__(key)
            except AttributeError:
                pass
        try:
            # Mutagen gives us a list of tags, so just get the first one.
            return self._file.tags[key][0]
        except KeyError:
            return self.d[key]


if __name__ == '__main__':
    song = Song("deadmau5 - The Veldt (8 minute edit) (feat. Chris James).flac")
    print(song['bits_per_sample'])
