
import json
import logging
import os
import time

##
# User defined options come from a file
##
CONFIG_FILENAME = 'config.json'
config_file = open(CONFIG_FILENAME, 'r')
config = json.load(config_file)
config_file.close()
del config_file
config['RootFolder'] = os.path.expanduser(config['RootFolder'])

##
# These are constants which should not be modified by the user.
##
SUPPORTED_FILETYPES = ['.flac']
DATABASE_FILENAME = 'music.db'
DATABASE_FILEPATH = os.path.join(config['RootFolder'], DATABASE_FILENAME)

def run():
    """Right now this creates the database and starts monitoring a folder.
    Then the user can search the database.
    """
    from music_guy.database import Database
    from music_guy.filemonitor import FileMonitor
    from bottle import run as app_run
    import music_guy.webapp

    logging.basicConfig(format='%(levelname)s:%(name)s: %(message)s',
                        level=logging.DEBUG)
    db = Database(DATABASE_FILEPATH)
    fm = FileMonitor(config['RootFolder'], db)
    fm.full_scan()
    fm.start()
    app_run()
    fm.stop()