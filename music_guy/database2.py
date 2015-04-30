
"""
This is kind of just a place holder database until I figure out something
better.  Hopefully most of the library will be flac, which means vorbis
comments as tags.  Vorbis comments can have multiple values for the same key,
which doesn't really play well in SQL. Playlists also work nicely in a document
store.
"""

import json

class Collection(object):

    def __init__(self, db):
        self.data = {}
        self.db = db
        self.indexes = {}

    def save(self, obj):
        # Generate _id
        _id = db.get_next_id()
        obj['_id'] = _id
        # Add to collection
        json_obj = json.dumps(obj)
        self.data[_id] = json_obj
        # Update indexes
        for key in self.indexes:
            if key in obj:
                self.update_index(key, obj, json_obj)

    def create_index(self, key):
        self.indexes[key] = {}

    def update_index(self, key, obj, json_obj):
        value = obj[key]
        index = self.indexes[key]
        if value not in index:
            index[value] = set()
        index[value].add(json_obj)

    def find(self, d):
        if '_id' in d:
            return data[_id]

        keys = d.keys()
        current = set(keys.pop())

        for key in keys
            if key in indexes:

        # Linear search
        for key in keys


class Database(object):

    def __init__(self):
        self.collections = {}
        self.next_id = 0

    def make_collection(self, coll_name):
        self.collections[coll_name] = Collection(self)

    def get_next_id(self):
        temp = self.next_id
        self.next_id += 1
        return temp

    def __getattr__(self, attr):
        return self.collections[attr]


if __name__ == '__main__':
    db = Database()
    db.make_collection('test')
    db.test.create_index('c')
    db.test.create_index('b')
    for i in range(100000):
        o = {'a':'string'+str(i), 'b':i, 'c':'constant'}
        db.test.save(o)
    for i in range(100):
        o = {'a':'string'+str(i), 'b':i, 'c':'special'}
        db.test.save(o)
    print('added')
    print(db.test.find({'c':'special', 'b': 9}))

        

