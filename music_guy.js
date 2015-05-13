
var http = require('http');

var express = require('express');

var config = require('./config.js');
CONFIG = config('./config.json');

var FileMonitor = require('./filemonitor.js');
var Renamer = require('./renamer.js');
var WebUI = require('./webui');
var Db = require('./db.js').Db;
var RestAPI = require('./restapi.js');
var SubsonicAPI = require('./subsonic.js');
var WebSocketAPI = require('./websocketapi.js');

SUPPORTED_FILETYPES = {
    '.flac': true,
    '.mp3': true,
};

function MusicGuy() {
    var that = {
        port: 3000
    };
    console.log('Starting Music Guy...');

    that.webapp = express();
    that.server = http.createServer(that.webapp);
    that.webui = WebUI(that.webapp);
    that.server.listen(that.port);
    console.log('Listening on port', that.port,'...');

    if (CONFIG.enableRenamer) {
        that.renamer = Renamer(CONFIG.nameTemplate);
    }

    Db(function (db) {
        that.db = db;
        that.mediafiles = db.collection('mediafiles');
        that.fm = FileMonitor(that.db, CONFIG.musicFolder);

        that.restapi = RestAPI(db, that.webapp);
        that.subsonicapi = SubsonicAPI(db);
        that.websocketapi = WebSocketAPI(that.server, db);
    });

    return that;
}

module.exports = MusicGuy;

mn = MusicGuy();
