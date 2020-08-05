app.controller('projectsController', function ProjectsController (ProjectsFactory, $http, $window, $scope) {
    var projectsController = this;

    projectsController.projects = [];
    projectsController.projectsHtml = "";

    function refresh(businessId) {
        allProjects(businessId);
    }

    projectsController.getAllProjects = function (businessId) {
        allProjects(businessId)
    };

    projectsController.removeProject = function (projectId, businessId) {
        deleteProjectBy(projectId, businessId);
    };

    function deleteProjectBy(projectId, businessId) {
        $http({
            method: 'DELETE',
            url: '/businesses/' + businessId + '/projects/' + projectId
        }).then(function mySuccess() {
            refresh(businessId);
            alerts.autoCloseAlert('success-message', 'Project removed!!', '');
        }, function myError() {
            alerts.autoCloseAlert('title-and-text', 'Error deleting project', 'Please try again!');
        })
    }

    function allProjects(businessId) {
        ProjectsFactory.getAllProjects(businessId,
            function mySuccess (response) {
                projectsController.projects = response.data.data;
            }, function myError (response) {
                console.log(response.statusText)
        });
    }
});

app.factory('ProjectsFactory', function ProjectsFactory ($http) {
    var getAllProjects = function (businessId, successFunction, errorFunction) {
        $http({method: 'GET', url: '/businesses/'+ businessId + "/projects"}).then(successFunction, errorFunction)
    };

    return {
        getAllProjects: getAllProjects
    }
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
function NewProjectController($http) {
    var newProjectController = this;

    newProjectController.formData = {};

    newProjectController.createNew = function () {
        console.log("create new project button clicked");
        newProject()
    };

    function newProject() {
        var newProject = {};
        newProject = newProjectController.formData;
        newProject.businessId = newProjectController.businessId;
        console.log(newProject);

        $http({
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            url: '/businesses/projects',
            data: newProject,
        }).then(function mySuccess() {
            alerts.autoCloseAlert('success-message', 'New Project has been created', 'Awesome!');
        }, function myError() {
            alerts.autoCloseAlert('success-message', 'Error Creating new project', 'Please try again!');
        })
    }

}