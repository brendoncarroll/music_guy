#!/usr/bin/env python3

import collections
import os

from mutagen import File as MutagenFile
from mutagen.easyid3 import EasyID3 as MutagenID3

STREAM_FIELDS = ['length', 'sample_rate', 'channels', 'bits_per_sample']

def add_mixin(obj, mixin, typename):
    """Adds a mixin to the instance.
    """
    old_type = type(obj)
    obj.__class__ = type(typename, (old_type, mixin), {})

def make_mediafile(filename):
    # Let Mutagen choose the filetype
    mediafile = MutagenFile(filename, easy=True)
    mediafile.filename = filename
    # Add our own MixIn
    old_type = type(mediafile)
    if isinstance(mediafile, MutagenID3):
        mixin = ID3MixIn
        typename = 'ID3MediaFile'
    else:
        mixin = MediaFileMixIn
        typename = 'MediaFile'

    add_mixin(mediafile, mixin, typename)
    return mediafile

class MediaFileMixIn(object):

    def as_dict(self):
        d ={}
        for k, v in self.tags.items():
            d[k] = v
        for k in STREAM_FIELDS:
            try:
                d[k] = self.info.__getattr__(k)
            except AttributeError:
                pass
        d['path'] = os.path.abspath(self.filename)
        d['mtime'] = os.stat(self.filename)
        return d

    def get_mtime(self):
        return os.stat(self.filename).st_mtime

class ID3MixIn(MediaFileMixIn):
    
    def as_dict():
        print(hello)

if __name__ == '__main__':
    import pprint
    m = make_mediafile("/home/brendon/Music/Taylor Swift/Red/Taylor Swift - 22.flac")
    m = make_mediafile('/home/brendon/Music/Death Cab for Cutie/Plans/Death Cab for Cutie - Someday You Will Be Loved.ogg')
    m = make_mediafile('/home/brendon/Music/Avicii/Levels/Avicii - Levels.mp3')
    pprint.pprint(m.as_dict())