#!/usr/bin/env python3

import logging
import os
import time

from database import Database
from filemonitor import FileMonitor
from config import config, DATABASE_FILEPATH

def main():
    """Right now this creates the database and starts monitoring a folder.
    Then the user can search the database.
    """
    logging.basicConfig(format='%(levelname)s:%(name)s: %(message)s',
                        level=logging.DEBUG)
    db = Database(DATABASE_FILEPATH)
    fm = FileMonitor(config['RootFolder'], db)
    fm.full_scan()
    fm.start()
    print('Press ^C to end or enter a search query')
    try:
        while(True):
            db.search(input('>'))
    except KeyboardInterrupt:
        pass
    fm.stop()

if __name__ == '__main__':
    main()