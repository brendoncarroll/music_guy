var fs = require('fs-extra');
var util = require('util');
var js2xmlparser = require('js2xmlparser');
var express = require('express');
var http = require('http');

SUBSONIC_PORT = 4040;

SUBSONIC_ERROR_LOOKUP = {
    0: "A generic error",
    10: "Required parameter is missing.",
    20: "Incompatible Subsonic REST protocol version. Client must upgrade.",
    30: "Incompatible Subsonic REST protocol version. Server must upgrade.",
    40: "Wrong username of password",
    50: "User is not authorized for the given operation",
    60: "The trial period for the Subsonic server is over. Please upgrade to Subsonic Premium. Visit subsonic.org for details.",
    70: "The requested data was not found."
};

ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

function toXml(subsonicObject) {
    return js2xmlparser("subsonic-response", subsonicObject, {
        declaration: {
            include: false,
        }
    });
}

function SubsonicDate() {
    var date = new Date();
    return date.toISOString();
}

function SubsonicResponse() {
    var that = {
        "@": {
            xmlns : "http://subsonic.org/restapi",
            status: "ok",
            version: "1.12.0",
        }
    };
    return that;
}

function SubsonicLicense(email, key) {
    var that = SubsonicResponse();
    that.license = {
        "@": {
            valid: true,
            email: email,
            key: key,
            date: SubsonicDate(),
        }
    };
    return that;
}

function SubsonicError(errorCode) {
    var that = SubsonicResponse();
    that['@'].status = "failed";
    that.error = {
        "@": {
            code: errorCode,
            message: SUBSONIC_ERROR_LOOKUP[errorCode],
        }
    };
    return that;
}

function SubsonicMusicFolders() {
    var that = SubsonicResponse();
    that.musicFolders = {
        musicFolder: [
            {
                "@": {
                    id: 1,
                    name: "Music",
                }
            }
        ]
    };
    return that;
}

function SubsonicIndexes(alphaMap) {
    var that = SubsonicResponse();
    that.indexes = {
        "@": {
            lastModified: Date.now(),
        },
        index: [],
    };
    for (var letter in folders) {
        var artists = alphaMap[letter];
        for (var i in artists) {
            var artist = artists[i];
        }
    }

    return that;
}


function SubsonicAPI(db) {
    var that = {
        db: db,
    };
    that.app = express();
    that.server = http.createServer(that.app);
    that.server.listen(SUBSONIC_PORT);

    that.app.post('/rest/ping.view', function (req, res) {
        res.send(toXml(SubsonicResponse()));
    });

    that.app.post('/rest/getLicense.view', function (req, res) {
        res.send(toXml(SubsonicLicense()));
    });

    that.app.post('/rest/getMusicFolders.view', function (req, res) {
        res.send(toXml(SubsonicMusicFolders()));
    });

    that.app.post('/rest/getIndexes.view', function (req, res) {
        //var str = fs.readFileSync('subsonic-index-test.txt');
        res.send(str);
    });

    that.app.post('/rest/getRandomSongs.view', function (req, res) {
        res.send(SubsonicResponse());
    });

    return that;
}

module.exports = SubsonicAPI;
