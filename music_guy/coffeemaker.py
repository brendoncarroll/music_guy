"""A little module for CoffeScript asset management
"""

import coffeescript
import os
import re

EXTENSIONS = ['.coffee', '.js']

class Environment(object):

    def __init__(self, directories):
        self.directories = directories

    def get(self, logical_path):
        for ext in EXTENSIONS:
            name = use_ext(logical_path, ext)
            for directory in self.directories:
                path = os.path.join(directory, name)
                if os.path.exists(path):
                    job = Job(path)
                    return job.run()

class Job(object):

    def __init__(self, path):
        self.todo = [os.path.abspath(path)]
        self.worklist = []

    def run(self):
        while self.todo:
            path = self.todo.pop()
            self.preprocess(path)
            self.worklist.insert(0, path)
        return self.process()

    def process(self):
        compiled = []
        for path in self.worklist:
            if os.path.splitext(path)[1] == '.coffee':
                compiled.append(coffeescript.compile_file(path))
            else:
                compiled.append(read(path))
        return "".join(compiled)

    def preprocess(self, path):
        directory = os.path.dirname(path)
        with open(path, 'r') as f:
            for line in f:
                if line[0:2] == '#=':
                    require = re.search(r'require (.+)', line)
                    require_dir = re.search(r'require_directory (.+)', line)
                    if require:
                        fpath = os.path.join(directory, require.group(1))
                        self.require(fpath)
                    if require_dir:
                        dpath = os.path.join(directory, require_dir.group(1))
                        self.require_directory(dpath)

    def require(self, path):
        if path not in self.worklist:
            self.todo.append(path)

    def require_directory(self, dirpath):
        for root, dirs, files in os.walk(dirpath):
            for f in files:
                if os.path.splitext(f)[1] in EXTENSIONS:
                    self.require(os.path.join(root, f))


def use_ext(filename, ext):
    """Translates xyz.js to xyz.coffee
    """
    name = os.path.splitext(filename)[0]
    return name + ext

def read(filename):
    with open(filename, 'r') as f:
        return "".join(f.readlines())


if __name__ == '__main__':
    env = Environment(['web/scripts'])
    print(env.get('app.js'))
