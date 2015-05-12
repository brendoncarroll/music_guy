# Music Guy
Music Guy is a music management and streaming application designed for a home media server.  The philosophy is that when you acquire music, you shouldn't have to deal with renaming and organizing it.  You should just drag and drop, and walk away.  When its time to enjoy your music, it is available via a web interface, or an app on your phone.  If you want to get at your files, they are already organized in an intuitive hierarchy.

## Installation
1. Clone the repository
2. Run `npm installl`
3. Edit the `config.json` file.
```
{
	"musicFolder": "/Path/to/Your/Music/",
	"nameTemplate": "%albumartist%/%album%/%title%",
	"enableRenamer": false,
	"useMongoDB": false
}
```
Please be careful enabling the renamer, it will rename all the files in your music folder to match the naming scheme.
4. Run `node music_guy.js` to start the application.  By default the api is on port 3000.

## Features
- **Auto organization by tags** Music is organized automatically using the `nameTemplate` string in config.json.  If a file is missing a needed tag it will not be renamed.
- **Automatically add music** The music folder is watched for new files.
- **Supports flac and mp3.**
- **Use mongodb or tingodb** (an embedded database for NodeJS)
- **Listen to music through the web interface**
