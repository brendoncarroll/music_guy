
var fs = require('fs-extra');

var WebSocketServer = require('ws').Server;

function Channel(name) {
    return {
        name: name,
        players: {},
    };
}

function WebSocketAPI(server, db) {
    var that = {
        server: server,
        db: db,
        mediafiles: db.collection('mediafiles'),
        chan: Channel('global'),
        sockets: {},
    };

    that.wss = new WebSocketServer({
        server: server,
    });

    that.getNewID = function () {
        if (that.nextID === undefined) {
            that.nextID = 0;
        }
        var temp = that.nextID;
        that.nextID += 1;
        return temp;
    };

    that.request = function (ws, dataObj) {
        console.log('Got request for ', dataObj);
        that.mediafiles.findOne({'_id': dataObj.id}, function (err, doc) {
            var audioStream = fs.createReadStream(doc.path);
            audioStream.on('data', function (data) {
                ws.send(audioStream, {binary: true});
            });
        });
    };

    that.methodMap = {
        request: that.request,
    };

    that.handleMessage = function (data, flags) {
        //console.log(data, flags);
        var ws = this;
        var dataObj = JSON.parse(data);
        var method = that.methodMap[dataObj.type];
        if (method !== undefined) {
            method(ws, dataObj);
        }

    };

    that.handleClose = function () {
        console.log('WebSocket disconnected');
        delete that.sockets[this.id];
    }

    that.handleConnection = function(ws) {
        ws.id = that.getNewID();
        console.log('WebSocket connected.', ws.id);

        that.sockets[ws.id] = ws;
        ws.on('message', that.handleMessage);
        ws.on('close', that.handleClose);
        ws.send(JSON.stringify({

        }));
    };

    that.wss.on('connection', that.handleConnection);


    return that;
}

module.exports = WebSocketAPI;
