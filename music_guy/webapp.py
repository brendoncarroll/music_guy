from os.path import dirname, join

from bottle import get, static_file, response
from pystache import Renderer

from music_guy.coffeemaker import Environment
import music_guy.api

d = dirname(__file__)
renderer = Renderer(search_dirs=[join(d, 'web/templates')])
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
