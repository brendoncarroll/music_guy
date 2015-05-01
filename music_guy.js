
var http = require('http');

var MongoClient = require('mongodb').MongoClient;

var FileMonitor = require('./filemonitor.js');
var Renamer = require('./renamer.js');
var config = require('./config.js');
var WebUI = require('./webui');
var Db = require('./db.js');

SUPPORTED_FILETYPES = {
    '.flac': true,
    '.mp3': true,
};

CONFIG = config('./config.json');

function MusicNode() {
    var that = {};

    that.server = http.createServer();
    that.server.listen(3000);

    that.renamer = Renamer('./%albumartist%/%album%/%title%');
    that.webui = WebUI(that.server);

    Db(function (db) {
        that.db = db;
        that.mediafiles = db.collection('mediafiles');
        that.fm = FileMonitor(that.db, CONFIG.musicFolder);
    });

    return that;
}

module.exports = MusicNode;

mn = MusicNode();

setTimeout(function () {
    var c = mn.mediafiles.find({'title': {$regex: /.*Tele.*/}});
    c.toArray(function (err, docs) {
        console.log(err, docs);
    });

}, 1000);
