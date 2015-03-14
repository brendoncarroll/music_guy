import json

from bottle import get, post, request, static_file
from music_guy import db

@get('/library')
def library():
    return db.stats()

@get ('/library/albums')
def albums():
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

@get('/library/songs/<songid:int>')
def get_song(songid):
    return db.get_song(songid)

@get('/library/search')
def search():
    try:
        query = request.query['q']
    except:
        return
    data = {}
    data['songs'] = db.search(query)
    return data

@get('/queues/<queueid:int>')
def queues(queueid):
    data = {}
    data[queue] = list()
    return data

@get('/play/<songid:int>')
def play(songid):
    song = db.get_song(songid)
    return static_file(song['filepath'], root='/')
