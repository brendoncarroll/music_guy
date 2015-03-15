var app = angular.module('app', [
    'ngRoute',
    'appControllers'
]);

app.config(function($routeProvider) {
        $routeProvider.when('/', {
            templateUrl: '/templates/main-list.html',
            controller: 'ListCtrl'
        }).otherwise({
            redirectTo: '/'
        });
});
