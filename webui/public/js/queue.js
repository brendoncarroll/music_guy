var Queue = angular.module('Queue', ['Player']);

Queue.directive('mgQueue', function () {
    var that = {
        templateUrl: '/templates/queue.html'
    };
    return that;
});

Queue.controller('QueueCtrl', function ($scope, PlayerService) {
    $scope.getQueue = PlayerService.getQueue;
});
