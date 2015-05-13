var app = angular.module('app', [
    'ngRoute',
    'Main',
]);

app.config(function($routeProvider) {
        $routeProvider.when('/', {
            templateUrl: '/templates/main.html',
            controller: 'MainCtrl'
        });
});
