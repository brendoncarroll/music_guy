var Player = angular.module('Player', []);

Player.service('PlayerService', function (RestAPI, $rootScope) {
    var self = this;
    self.assetCache = {};
    self.queue = [];

    this.getQueue = function() {
        return self.queue;
    };

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
            self.forward();
            $rootScope.$apply();
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

Player.directive('mgPlayer', function () {
    var that = {
        templateUrl: '/templates/player.html'
    };
    return that;
});

Player.controller('PlayerCtrl', function ($scope, PlayerService) {

    $scope.isPlaying = PlayerService.isPlaying;

    $scope.pause = function(){
        PlayerService.pause();
    };

    $scope.play = function() {
        PlayerService.play();
    };

    $scope.forward = function() {
        PlayerService.forward();
    };

    $scope.backward = PlayerService.backward;
});
