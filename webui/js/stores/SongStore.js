var EventEmitter = require('events').EventEmitter;
var MGDispatcher = require('../dispatchers/MGDispatcher.js');

var CHANGE_EVENT = 'change';

var songs = {
};

SongStore = new EventEmitter();

SongStore.getAll = function () {
    return songs;
};

MGDispatcher.register(function (action) {
    switch (action.actionType) {
        case 'SEARCH_RESULTS':
        songs = action.results;
        SongStore.emit('change');
        break;
    }
});


SongStore.getAll = function () {
    return songs;
};



module.exports = SongStore;