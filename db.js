
var MongoClient = require('mongodb').MongoClient;

function Db(callback) {
    MongoClient.connect('mongodb://localhost/music_guy', function (err, db) {
        if (err) {
            throw err;
        }
        var mediafiles = db.collection("mediafiles");
        // // DEV
        //mediafiles.remove();

        mediafiles.ensureIndex("path", {unique: true});
        mediafiles.ensureIndex({
            title: 1,
            artist: 1,
            genre: 1,
            albumartist: 1,
        });
        callback(db);
    });
};

module.exports = {
    Db: Db,
};
