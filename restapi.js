
var fs = require('fs-extra');

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
            res.json({
                results:{
                    titles: docs
                }
            });
        });
    });

    that.app.get('/library/search/', function (req, res) {
        var query = req.query.q;
        var results = {titles:[]};
        function regex(string) {
            return new RegExp('.*' + string + '.*', 'i');
        }
        var count = 0;
        function finish() {
            if (count >= 2) {
                res.json({results: results});
                console.log(results);
            }
            count++;
        }
        function single_field(field) {
            dbq = {};
            dbq[field] = regex(query)
            that.mediafiles.find(dbq, {
                title: 1,
                artist: 1,
                album: 1,
                genre: 1,
            })
            .limit(20)
            .toArray(function (err, docs) {
                if (err) {
                    console.error(err);
                    return;
                }
                //console.log(docs);
                results[field + 's'] = docs;
                docs.forEach(function (song) {
                     Object.keys(song).forEach(function (key) {
                         var value = song[key];
                         if (value.constructor === Array) {
                             song[key] = value.join(', ');
                         }
                     });
                 });
                finish();
            });
        }
        single_field('title');
        single_field('artist');
        single_field('album');
    });

    that.app.get('/stream/:id', function (req, res) {
        that.mediafiles.findOne({'_id': ObjectID(req.params.id)}, function (err, doc) {
            res.sendFile(doc.path, {lastModified: false}, function (err) {
                res.end();
            });
        });
    });

    that.app.get('/library/waveforms/:id', function (req, res) {
        var list = [];
        for(var i=0; i<1000; i++) {
            list.push(Math.random());
        }
        res.send(list);
    });

    return that;
};
