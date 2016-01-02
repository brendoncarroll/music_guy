
var MGDispatcher = require('../dispatchers/MGDispatcher.js');

module.exports = {

    playAtCommand: function (time) {
        MGDispatcher.dispatch({
            actionType: 'COMMAND_PLAY',
            time: time,
        });
    },

    pauseAtCommand: function (time) {
        MGDispatcher.dispatch({
            actionType: 'COMMAND_PAUSE',
            time: time,
        });
    },

    queueSong: function (song) {
        MGDispatcher.dispatch({
            actionType: 'ADD_TO_QUEUE',
            song: song,
        });
    },

    seek: function (time) {
        MGDispatcher.dispatch({
            actionType: 'COMMAND_SEEK',
            time: time
        });
    },

    setVolume: function (level) {

    }
};