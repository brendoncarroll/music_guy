from os.path import dirname, join

from bottle import get, static_file, response
from pystache import Renderer

from music_guy.coffeemaker import Environment
from music_guy.api import *

d = dirname(__file__)
renderer = Renderer(search_dirs=[join(d, 'templates/')])
env = Environment([join(d, 'web/scripts')])

@get('/js/<filepath:path>')
def js(filepath):
    response.headers['Content-Type'] = 'text/javascript'
    return env.get(filepath)

@get('/<filepath:path>')
def public(filepath):
    return static_file(filepath, root=join(d, 'web/public/'))

@get('/')
def root():
    return renderer.render_name('layout')
