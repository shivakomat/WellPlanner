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


// PROD Constants
app.constant('config', {
        appHost: 'https://well-wedding-planner.herokuapp.com',
        appAngularAssets: 'https://well-wedding-planner.herokuapp.com/assets/javascripts/angular/'
});

// Production base URL

var baseUrl = "https://well-wedding-planner.herokuapp.com/assets/javascripts/angular";

// Dev Base URL
// var baseUrl = "http://localhost:7000/assets/javascripts/angular";

app.constant('templates', {
        newProjectModal:  baseUrl + "/newProjectModal.html",
        newTaskListModal: baseUrl + "/newTaskListModal.html",
        newSubTaskModal: baseUrl + "/newSubTaskModal.html",
        deleteTaskListModal: baseUrl + "/deleteTaskListModal.html",
        editTaskModal: baseUrl + "/editTaskModal.html",
        editVendorContactModal: baseUrl + "/editVendorModal.html",
        newTeamMemberModal: baseUrl + "/newTeamMember.html",
        editClientModal: baseUrl + "/editClientModal.html",
        newBudgetBreakdownListModal: baseUrl + "/newBudgetBreakdownModal.html",
        newBreakdownItemModal: baseUrl + "/newBreakdownItemModal.html"
});