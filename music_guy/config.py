#!/usr/bin/env python3

import json
import os

CONFIG_FILENAME = 'config.json'

##
# User defined options come from a file
## 
config_file = open(CONFIG_FILENAME, 'r')
config = json.load(config_file)
config_file.close()
del config_file
config['RootFolder'] = os.path.expanduser(config['RootFolder'])

##
# These are constants which should not be modified by the user.
##

SUPPORTED_FILETYPES = ['.flac', '.ogg', '.mp3']
DATABASE_FILENAME = 'music.db'
DATABASE_FILEPATH = os.path.join(config['RootFolder'], DATABASE_FILENAME)



    

