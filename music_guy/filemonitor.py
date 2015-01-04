#!/usr/bin/env python3

import os
import logging
import threading
import re

from watchdog.events import PatternMatchingEventHandler, FileMovedEvent
from watchdog.observers import Observer
from music_guy import config, SUPPORTED_FILETYPES

logger = logging.getLogger(__name__)

class FileMonitor(object):
    """A class to monitor a directory and trigger database queries when
    appropriate.
    """

    def __init__(self, dir_path, musicdb):
        self.dir_path = dir_path
        self.musicdb = musicdb
        self.observer = Observer()
        self.event_handler = MusicEventHandler(musicdb,
                                               SUPPORTED_FILETYPES)
        self.observer.schedule(self.event_handler,
                              self.dir_path,
                              recursive=True)
        logger.info('Now monitoring "%s"', dir_path)

    def __del__(self):
        self.stop()

    def full_scan(self):
        """Walks the entire directory tree for the folder being monitored.  It
        queries the database for every file and then updates it if
        necessary.
        """
        logger.info('Performing full scan on %s...' % self.dir_path)
        for dirname, dirnames, filenames in os.walk(self.dir_path):
            for filename in filenames:
                filepath = os.path.join(dirname, filename)
                name, extension = os.path.splitext(filename)
                if extension in SUPPORTED_FILETYPES:
                    self.musicdb.check(filepath)
        logger.info('Full Scan complete.')

    def start(self):
        """Starts watching for filesystem events.  (Using watchdog).  This will
        spawn a new thread.
        """
        if not self.observer.is_alive():
            self.observer.start()
            logger.debug('Watching for filesystem events')

    def stop(self):
        """Stops watching for filesystem events.
        """
        if self.observer.is_alive():
            self.observer.stop()
            self.observer.join()
            logger.debug('No longer watching for filesystem events')

    def ignore_move(self, src_path, dest_path):
        self.event_handler.skip((FileMovedEvent(src_path, dest_path)))


class MusicEventHandler(PatternMatchingEventHandler):
    """Class for handling events generated by an Observer.  In order
    for an event to be noticed it must involve a supported filetype.  Certain
    events can be skipped by adding them to the set of skipped events.
    """
    def __init__(self, musicdb, supported_filetypes):
        self._skipset = set()
        self._setlock = threading.Lock()
        self.musicdb = musicdb
        newpatterns = []
        for filetype in supported_filetypes:
            newpatterns.append('*' + filetype)
        super().__init__(patterns=newpatterns)

    def dispath(self, event):
        """Modified dispatch method to first check if the event is supposed to
        be skipped before calling the parent's dispatch method to handle the
        event.
        """
        if event not in self._skipset:
            super().dispath(event)
        else:
            with self._setlock:
                self._skipset.remove(event)

    def on_any_event(self, event):
        """Called for all events.
        """
        logger.debug('Found an event %s', event)

    def on_moved(self, event):
        """Called for movement inside the directory
        """
        self.musicdb.swap_filepath(event.src_path, event.dest_path)

    def on_created(self, event):
        """Called when file is moved into or created in the directory
        """
        self.musicdb.check(event.src_path)

    def on_deleted(self, event):
        """Called when a file is deleted or moved out of the directory
        """
        self.musicdb.mark_missing(event.src_path)

    def on_modified(self, event):
        """Called when a file is saved inside a directory
        """
        self.musicdb.add(event.src_path)

    def skip(self, event):
        """The next event that is equivalent to `event` will be skipped.
        """
        with self._setlock:
            self._skipset.add(event)



