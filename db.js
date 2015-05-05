
var path = require('path');
var fs = require('fs-extra');

if (CONFIG.useMongoDB) {
    var MongoClient = require('mongodb').MongoClient;
    var ObjectID = require('mongodb').ObjectID;
} else {
    var Engine = require('tingodb')();
    var ObjectID = function (x) {
        return x;
    };
}

// Ensures indexes for the 'mediafiles' colleciton
function setupMediafiles(mediafiles) {
    //mediafiles.remove();
    //mediafiles.dropIndexes();

    mediafiles.ensureIndex({path: 1}, {unique: true});
    mediafiles.ensureIndex({title: 1});
    mediafiles.ensureIndex({albumartist: 1});
    mediafiles.ensureIndex({artist: 1});
    mediafiles.ensureIndex({genre: 1});
}

function Db(callback) {
    if (CONFIG.useMongoDB) {
        MongoClient.connect('mongodb://localhost/music_guy', function (err, db) {
            if (err) {
                throw err;
            }
            var mediafiles = db.collection("mediafiles");
            setupMediafiles(mediafiles);

            callback(db);
        });
    } else {
        var dbFolder = path.join(CONFIG.musicFolder, '_music_guy');
        fs.ensureDirSync(dbFolder);
        var db = new Engine.Db(dbFolder, {});
        var mediafiles = db.collection('mediafiles');
        setupMediafiles(mediafiles);
        callback(db);
    }
}

module.exports = {
    Db: Db,
    ObjectID: ObjectID,
};
