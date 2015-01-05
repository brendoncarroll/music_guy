import json

from bottle import get, post
from music_guy import db

@get('/library')
def library():
    pass

@get('/library/artists')
def artists():
    pass
    # return a list of artists

@get('/library/songs')
def songs():
    data = {}
    data['songs'] = db.get_all()
    return data

@get('/library/songs/<songid>')
def get_song(song_id):
    pass
    