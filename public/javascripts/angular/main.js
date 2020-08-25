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


// App Configs

// PROD Constants

app.constant('config', {
        appHost: 'https://well-wedding-planner.herokuapp.com',
        appAngularAssets: 'https://well-wedding-planner.herokuapp.com/assets/javascripts/angular/'
});

app.constant('templates', {
        newProjectModal:  "https://well-wedding-planner.herokuapp.com/assets/javascripts/angular/newProjectModal.html",
        newTaskListModal: "https://well-wedding-planner.herokuapp.com/assets/javascripts/angular/newTaskListModal.html",
        newSubTaskModal: "https://well-wedding-planner.herokuapp.com/assets/javascripts/angular/newSubTaskModal.html",
        deleteTaskListModal: "https://well-wedding-planner.herokuapp.com/assets/javascripts/angular/deleteTaskListModal.html",
        editTaskModal: "https://well-wedding-planner.herokuapp.com/assets/javascripts/angular/editTaskModal.html"
});


// Local Constants
// app.constant('config', {
//         appHost: 'http://localhost:7000/',
//         appAngularAssets: 'http://localhost:7000/assets/javascripts/angular/'
// });
//
// app.constant('templates', {
//         newProjectModal:  "http://localhost:7000/assets/javascripts/angular/newProjectModal.html",
//         newTaskListModal: "http://localhost:7000/assets/javascripts/angular/newTaskListModal.html",
//         newSubTaskModal: "http://localhost:7000/assets/javascripts/angular/newSubTaskModal.html",
//         deleteTaskListModal: "http://localhost:7000/assets/javascripts/angular/deleteTaskListModal.html",
//         editTaskModal: "http://localhost:7000/assets/javascripts/angular/editTaskModal.html"
// });