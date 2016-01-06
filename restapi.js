
var fs = require('fs-extra');

var express = require('express');

module.exports = function RestAPI(lib, app) {
    var that = {
        lib: lib,
        app: app,
    };

    that.app.get('/library/songs/', function (req, res) {
      that.lib.random(function (results) {
        res.json({results: results});
      })
    });

    that.app.get('/library/search/', function (req, res) {
        var query = req.query.q;
        that.lib.search(query, function (results) {
          res.json({results: results});
        })

    });

    that.app.get('/stream/:id', function (req, res) {
      that.lib.get(req.params.id, function (doc) {
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
