# Music Guy
Music Guy is a music management and streaming application designed for a home media server.  The philosophy is that when you acquire music, you shouldn't have to deal with renaming and organizing it.  You should just drag and drop, and walk away.  When its time to enjoy your music, it is available via a web interface, or an app on your phone.  If you want to get at your files, they are already organized in an intuitive hierarchy.

It should be noted this project is in its earliest stages, and does a small fraction of what is discussed, but in the interest of "README driven development", many unimplemented features are outlined here anyway.


## Backend
There are two essential components which can power any number of secondary features.  The database and the file-monitor.

### The Music Database
The database keeps track of all the metadata associated with all of the files.  Nothing too fancy, it is really just a cache of what is spread out in the tags of multiple files.  The database is stored in the same folder as the music.  Playlists and music related things should also be stored here, but nothing related to users, sessions, or anything like that.

### The File Monitor
The file-monitor along with the user interface are what drive the application.  When the contents of the music folder are modified, the file monitor takes action, adding new files to the database, and triggering the action of secondary components.  Secondary components could be a renaming module or an album art fetcher.

## Frontend
The interface is a single paged javascript application.  The user is greated with a login prompt.  Multiple users are supported to facilitate offices or families who would like to enjoy the same content.  After authentication the user is brought to the main interface.

There are 4 sections of the interface.  The working pane, the queue, the library, and the player.

### Player
The player shows the currently playing track, has controls to start and stop, playback, volume, etc.

### Working Area
This is where stuff happens.  When the user searches, it populates this area, when they want to see a playlist, it dumps the playlist contents here.  The default action for clicking on a song here is not to play it, but instead add it to the queue.

### The Queue
The songs to be played next, in order.  This is a very simple concept, but is too often gotten wrong.  The queue must be persistent, it should eventually be able to populate itself, either randomly or intelligently, and it should be able to be shared between users.

### The Library
This is an area, opposite the queue, which organizes information stored on the server.  Playlists genres and starred songs are all available here.

### Other Frontend Actions
- File upload. While the primary way to add content should be through the operating system, by moving files into the music folder, it should be easy to add content remotely.
- User management.  This should be very minimal, you need to be able to add and delete users and thats about it.

#### Frontend Database
The front end has its own database. There needs to be some place to store the user information and it should not be mucking up the music folder.

## Scalability
It **does not** need to scale well with the amount of users.  As previously stated, this is for the individual or small community.

It **does** need to scale well with the amount of songs.  It is expected that users could have hundreds of thousands to millions of songs.
