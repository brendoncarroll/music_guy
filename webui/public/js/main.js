
var main = angular.module('Main', ['Queue', 'Player']);

main.service('RestAPI', function ($http) {
    var self = this;

    this.getSongs = function (callback) {
        $http.get('/library/songs').success(function(data) {
            callback(data.songs);
        });
    };

    this.search = function (query, callback) {
        $http.get('/library/search', {
            params: {
                q : query
            }
        }).success(function(data) {
            callback(data.songs);
        });
    };
});

// main.service('WebSocketAPI', function () {
//     var self = this;
//     var ws = new WebSocket("ws://" + location.host);
//     var methodMap = {
//         "sync": PlayerService.play,
//         "pause": PlayerService.pause,
//     };
//
//     ws.onopen = function (event) {
//         console.log('socket open');
//     };
//
//     ws.onmessage = function (event) {
//         console.log(event.data);
//
//     };
//
//     self.request = function(songid) {
//         ws.send(JSON.stringify({
//             type: 'request',
//             id: songid
//         }));
//     };
//
// });

main.controller('MainCtrl', function($scope, RestAPI, PlayerService) {

    function updateSongs(songs) {
        $scope.songs = songs;
    }

    $scope.$watch('query', function () {
        if ($scope.query) {
            RestAPI.search($scope.query, updateSongs);
        } else {
            RestAPI.getSongs(updateSongs);
        }
    });

    $scope.queueSong = PlayerService.queueSong;

    $scope.isPlaying = PlayerService.isPlaying;

    $scope.pause = function(){
        PlayerService.pause();
    };

    $scope.play = function() {
        PlayerService.play();
    };

    $scope.forward = function() {
        PlayerService.forward();
    }

    $scope.backward = PlayerService.backward;
});
