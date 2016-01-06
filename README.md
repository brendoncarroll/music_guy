# Music Guy
Music Guy is a music management and streaming application designed for a home media server.  The philosophy is that when you acquire music, you shouldn't have to deal with renaming and organizing it.  You should just drag and drop, and walk away.  When its time to enjoy your music, it is available via a web interface, or an app on your phone.  If you want to get at your files, they are already organized in an intuitive hierarchy.

## Installation
1. Clone the repository
2. Run `npm install`
3. Edit the `config.yml` file.  The default settings should be fine.
Please be careful enabling the renamer, it will rename all the files in your music folder to match the naming scheme.
4. Run `node music_guy.js` to start the application.  By default the api is on port 3000.

## Features
- **Auto organization by tags** Music is organized automatically using the `nameTemplate` string in config.json.  If a file is missing a needed tag it will not be renamed.
- **Automatically add music** The music folder is watched for new files.
- **Supports flac and mp3.**
- **Listen to music through the web interface**

## Planned Features
- **Queue** Queue songs up to play next.  Maybe gapless playback
- **Player Synchronization** All players will be attached to a channel and its state (which includes a queue).  Players will attempt to stay in step with channel by pausing, seeking, and changing songs at the same time.  DLNA devices could maybe be attached to a channel.
- **Metadata Repair** Use acoustIDs to look up metadata with the MusicBrainz database.  Ideally this would be totally behind the scenes.
- **Third Party Searching** When a song can't be found locally, search YouTube and Soundcloud.
- **Smart Playlists** The user creates rules and playlists are lazily created when needed.
