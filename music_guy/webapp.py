from os.path import dirname, join

from bottle import get, static_file, response

from music_guy.coffeemaker import Environment
import music_guy.api

d = dirname(__file__)
env = Environment([join(d, 'web/scripts')])

@get('/js/<filepath:path>')
def js(filepath):
    response.headers['Content-Type'] = 'text/javascript'
    f = env.get(filepath)
    if f is None:
    	return static_file(filepath, root='/web/public/js')
    else:
    	return f

@get('/<filepath:path>')
def public(filepath):
    return static_file(filepath, root=join(d, 'web/public/'))

@get('/')
def index():
	return static_file('index.html', root=join(d, 'web/public/'))
