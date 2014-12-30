"""A little module for serving coffescript files as if they were javascript
"""

import coffeescript
import os

EXTENSIONS = '.coffee'

class Environment(object):

    def __init__(self, directories):
        self.directories = directories

    def get(self, logical_path):
        name = xlate_ext(logical_path)
        for directory in self.directories:
            path = os.path.join(directory, name)
            if os.path.exists(path):
                return coffeescript.compile_file(path)

def xlate_ext(filename):
    """Translates xyz.js to xyz.coffee
    """
    name = os.path.splitext(filename)[0]
    return name + EXTENSIONS


if __name__ == '__main__':
    env = Environment(['web/scripts'])
    print(env.get('app.js'))