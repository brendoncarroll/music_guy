
var MongoClient = require('mongodb').MongoClient;
module.exports = function Db(callback) {
    MongoClient.connect('mongodb://localhost', function (err, db) {
        if (err) {
            throw err;
        }
        var mediafiles = db.collection("mediafiles");
        // // DEV
        mediafiles.remove();

        mediafiles.ensureIndex("path", {unique: true});
        mediafiles.ensureIndex({
            title: 1,
            artist: 1,
        });
        callback(db);
    });

};
