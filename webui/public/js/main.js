var main = angular.module('Main', []);

main.controller('MainCtrl', function($scope, $http) {

    $scope.$watch('query', function() {
        if ($scope.query) {
            $http.get('/library/search',
            {
                params: {
                    q : $scope.query
                }
            }).success(function(data) {
                $scope.songs = data.songs;
            });
        } else {
            $http.get('/library/songs').success(function(data) {
                $scope.songs = data.songs;
            });
        }
    });

    $scope.changeSong = function(song) {
        $scope.currentSong = song;
        $scope.player = AV.Player.fromURL('/play/' + song['_id']);
        $scope.player.preload();
        $scope.player.play();
        console.log($scope.player);
    };

    $scope.isPlaying = function() {
        if($scope.player) {
            return $scope.player.playing;
        } else {
            return false;
        }
    };

    $scope.pause = function(){
        if ($scope.player) {
            $scope.player.pause();
        }
        console.log('paused ' + $scope.player);
    };

    $scope.play = function() {
        if ($scope.player) {
            $scope.player.play();
        }
        console.log('play ' + $scope.player);
    };
});
