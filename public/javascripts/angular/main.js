'use strict';

var app =
    angular.module('wellPlanner', ['auth0', 'angular-storage', 'angular-jwt', 'ngMaterial', 'ui.router', 'ui.bootstrap']);

app.config(function ($provide, authProvider, $urlRouterProvider, $httpProvider, jwtInterceptorProvider) {
        $urlRouterProvider.otherwise('/');
});
