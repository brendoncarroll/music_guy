
var main = angular.module('Main', []);

main.service('PlayerService', function (RestAPI) {
    var self = this;
    self.assetCache = {};
    self.queue = [];

    this.play = function () {
        if (self.player) {
            self.player.play();
        }
    };

    this.pause = function () {
        if (self.player) {
            self.player.pause();
        }
    };

    this.isPlaying = function () {
        if (self.player) {
            return self.player.playing;
        }
        else {
            return false;
        }
    };

    this.forward = function () {
        self.queue = self.queue.slice(1);
        if (self.queue.length > 0) {
            self.changeSong(self.queue[0]._id);
        }
    };

    this.backward = function () {
        self.player.seek(0);
        console.log(self.player.currentTime);
    }

    this.changeSong = function (id) {
        if (self.assetCache[id] === undefined || true) {
            var newAsset = AV.Asset.fromURL('/stream/' + id);
            self.assetCache[id] = newAsset;
        }
        if (self.player !== undefined) {
            self.player.stop();
        }
        self.player = new AV.Player(self.assetCache[id]);
        self.player.on('end', function () {
            this.forward();
        });
        self.player.play();

    };

    this.queueSong = function (song) {
        self.queue.push(song);
        if (self.queue.length === 1) {
            self.changeSong(song._id);
        }
        console.log('Added to queue', self.queue);
    };
});

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
