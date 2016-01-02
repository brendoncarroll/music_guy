
var EventEmitter = require('events').EventEmitter;
var AV = require('av');
require('mp3');
require('flac.js');

var MGDispatcher = require('../dispatchers/MGDispatcher.js');

var PlayerStore = new EventEmitter();
var player1 = null;
var nowPlaying = undefined;

function play(time) {
    if (player1) {
        if (time) player.seek(time);
        player1.play();
    }
}

function pause(time) {
    if (player1) player.pause();
}

function stop() {
    if (player1) player1.stop();
}

function seek(time) {
    if (player1) player1.seek(time);
}

function handleProgress() {
    PlayerStore.emit('change');
}

function setupPlayer() {
    player1.on('progress', handleProgress);
}

function teardownPlayer() {
    stop();
    if (player1) {
        player1.off('progress', handleProgress);
    }
    
}

function changeSong(song) {
    teardownPlayer();
    player1 = new AV.Player.fromURL('/stream/' + song._id);
    player1.preload();
    setupPlayer();
    player1.play();
    nowPlaying = song;
    console.log(player1);
}

PlayerStore.getState = function () {
    var isPlaying = player1 ? player1.playing : false;
    var duration = player1 ? player1.duration : false;
    var currentTime = player1 ? player1.currentTime: false;
    var buffered = player1 ? player1.buffered: 0;
    return {
        isPlaying: isPlaying,
        duration: duration,
        currentTime: currentTime,
        nowPlaying: nowPlaying,
        buffered: buffered,
    };
}

MGDispatcher.register(function (action) {
    switch (action.actionType) {
        case 'COMMAND_PLAY':
            play(action.time);
            PlayerStore.emit('change');
        break;

        case 'COMMAND_PAUSE':
            pause(action.time);
            PlayerStore.emit('change');
        break;

        case 'ADD_TO_QUEUE':
            changeSong(action.song);
            PlayerStore.emit('change');
        break;

        case 'COMMAND_SEEK':
            seek(action.time);
        break;
    }
});

module.exports = PlayerStore;