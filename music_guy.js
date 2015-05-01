
var http = require('http');

var express = require('express');

var FileMonitor = require('./filemonitor.js');
var Renamer = require('./renamer.js');
var config = require('./config.js');
var WebUI = require('./webui');
var Db = require('./db.js').Db;
var RestAPI = require('./restapi.js');

SUPPORTED_FILETYPES = {
    '.flac': true,
    '.mp3': true,
};

CONFIG = config('./config.json');

function MusicGuy() {
    var that = {};

    that.webapp = express();
    that.server = http.createServer(that.webapp);
    that.server.listen(3000);

    that.renamer = Renamer(CONFIG.nameTemplate);
    that.webui = WebUI(that.webapp);

    Db(function (db) {
        that.db = db;
        that.mediafiles = db.collection('mediafiles');
        that.fm = FileMonitor(that.db, CONFIG.musicFolder);

        that.restapi = RestAPI(db, that.webapp);
    });

    return that;
}

module.exports = MusicGuy;

mn = MusicGuy();
