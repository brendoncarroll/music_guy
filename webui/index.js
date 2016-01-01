
var express = require('express');

function WebUI(app) {
    that = {
        app: app,
    };

    app.use(express.static(__dirname + '/public/'));

    return that;
}

module.exports = WebUI;
