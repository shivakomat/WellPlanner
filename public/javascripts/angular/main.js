'use strict';

var app =
    angular.module('wellPlanner', ['auth0', 'angular-storage', 'angular-jwt', 'ngMaterial', 'ui.router']);

app.config(function ($provide, authProvider, $urlRouterProvider, $httpProvider, jwtInterceptorProvider, $sceDelegateProvider) {
        $urlRouterProvider.otherwise('/');

        $sceDelegateProvider.resourceUrlWhitelist([
                // Allow same origin resource loads.
                'self',
                // Allow loading from our assets domain. **.
                'https://well-wedding-planner.herokuapp.com/assets/**'
        ]);
});
