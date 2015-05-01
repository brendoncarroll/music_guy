
var http = require('http');
var express = require('express');

var app = express();
var server = http.createServer(app);

function WebUI(server) {
    that = {
        server: server
    };

    that.app = express();
    server.on('request', app);

    app.use(express.static(__dirname + '/public/'));

    return that;
}

module.exports = WebUI;
