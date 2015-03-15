import os

from bottle import get, static_file

d = os.path.dirname(__file__)

@get('/<filepath:path>')
def public(filepath):
    return static_file(filepath,
                       root=os.path.join(d, 'public/'))

@get('/')
def root():
    return static_file('/public/index.html',
                       root=d)


