import json

from bottle import get, post, request
from music_guy import db

@get('/library')
def library():
    return {'numSongs' : 0,
            'numArtists' : 0}

@get('/library/artists')
def artists():
    pass
    # return a list of artists

@get('/library/songs')
def songs():
    data = {}
    data['songs'] = db.get_all()
    return data

@get('/library/songs/<songid:int>')
def get_song(songid):
    return db.get_song(songid)._asdict()

@get('/library/search')
def search():
    query = request.query['q']
    data = {}
    data['results'] = db.search(query)
    return data