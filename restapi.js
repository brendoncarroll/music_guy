
var express = require('express');
var ObjectID = require('./db.js').ObjectID;

module.exports = function RestAPI(db, app) {
    var that = {
        db: db,
        app: app,
        mediafiles: db.collection('mediafiles'),
    };

    that.app.get('/library/songs/', function (req, res) {
        that.mediafiles.find({}, {
            title: 1,
            artist: 1,
            album: 1,
            _id: 1,
        }).limit(20).toArray(function (err, docs) {
            docs.forEach(function (song) {
                Object.keys(song).forEach(function (key) {
                    var value = song[key];
                    if (value.constructor === Array) {
                        song[key] = value.join(', ');
                    }
                });
            });
            res.json({songs: docs});
        });
    });

    that.app.get('/library/search/', function (req, res) {
        var query = req.query.q;
        function regex(string) {
            return new RegExp('^' + string + '.*', 'i');
        }
        that.mediafiles.find({
            $or: [{title: regex(query)},
                {artist: regex(query)},
                {album: regex(query)}]
        }, {
            title: 1,
            artist: 1,
            album: 1,
            genre: 1,
        }).limit(20).toArray(function (err, docs) {
            if (err) {
                console.error(err);
                return;
            }
            docs.forEach(function (song) {
                Object.keys(song).forEach(function (key) {
                    var value = song[key];
                    if (value.constructor === Array) {
                        song[key] = value.join(', ');
                    }
                });
            });
            res.json({songs: docs});
        });
    });

    that.app.get('/play/:id', function (req, res) {
        that.mediafiles.findOne({'_id': ObjectID(req.params.id)}, function (err, doc) {
            res.sendFile(doc.path);
        });
    });

    return that;
};
