from os.path import dirname, join

from bottle import get, static_file
from pystache import Renderer

print(__file__)
d = dirname(__file__)
renderer = Renderer(search_dirs=[join(d, 'templates/')])

@get('/<filepath:path>')
def public(filepath):
    return static_file(filepath, root=join(d, 'web/public/'))

@get('/')
def root():
    return renderer.render_name('layout')
