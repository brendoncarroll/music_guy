#!/usr/bin/env node
"use strict"

var http = require('http');
var fs = require('fs-extra');

var express = require('express');

var config = require('./config.js');
global.CONFIG = config('./config.yml');

var FileMonitor = require('./filemonitor.js');
var Renamer = require('./renamer.js');
var WebUI = require('./webui');
var Library = require('./library.js');
var RestAPI = require('./restapi.js');
var SubsonicAPI = require('./subsonic.js');
var WebSocketAPI = require('./websocketapi.js');

global.SUPPORTED_FILETYPES = {
    '.flac': true,
    '.mp3': true,
};
global.MGFOLDER = CONFIG.musicFolder + '.mg/';
global.PORT = process.env.PORT | 3000;
fs.mkdirsSync(MGFOLDER);

function MusicGuy() {
    var that = {};
    console.log('Starting Music Guy...');

    that.webapp = express();
    that.server = http.createServer(that.webapp);
    that.webui = WebUI(that.webapp);
    that.server.listen(PORT);
    console.log('Listening on port', PORT,'...');

    if (CONFIG.enableRenamer) {
        that.renamer = Renamer(CONFIG.nameTemplate);
    }

    that.lib = new Library();
    that.fm = FileMonitor(that.lib, CONFIG.musicFolder);

    that.restapi = RestAPI(that.lib, that.webapp);
    //that.subsonicapi = SubsonicAPI(db);
    //that.websocketapi = WebSocketAPI(that.server, that.lib);

    return that;
}

module.exports = MusicGuy;

var mg = MusicGuy();
