var appControllers = angular.module('appControllers', []);

appControllers.controller('ListCtrl', function($scope, $http) {
    $scope.$watch('query', function() {
        if ($scope.query) {
            $http.get('/library/search',
            {
                params: {
                    q : $scope.query
                }
            }).success(function(data) {
                $scope.songs = data.songs
            });
        } else {
            $http.get('/library/songs').success(function(data) {
                $scope.songs = data.songs
            });
        }
    });

    $scope.changeSong = function(songID) {
        $scope.player = AV.Player.fromURL('/play/' + songID);
        $scope.player.preload();
        $scope.player.play();
        console.log($scope.player);
    };
});