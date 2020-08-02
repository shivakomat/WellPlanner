'use strict';

app.controller('projectsController', function ($http, $window, $scope) {
    var projectsController = this;




});

app.directive('newProjectModal',  [NewProjectModalDirective]);
function NewProjectModalDirective() {
    return{
        templateUrl:  "http://localhost:7000/assets/javascripts/angular/newProjectModal.html",
        scope: {},
        bindToController: {
            businessId: '='
        },
        controller: NewProjectController,
        controllerAs: 'newProjectController'

    }

}

app.controller('newProjectController', [NewProjectController]);
function NewProjectController() {
    var newProject = this;

    console.log("new project controller created");

    newProject.formData = {};

    newProject.createNew = function () {
        console.log("create new project button clicked");
        console.log(newProject.formData);
    };

}