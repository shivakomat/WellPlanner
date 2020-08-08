app.directive('newProjectModal',  [NewProjectModalDirective]);
function NewProjectModalDirective() {
    return{
        templateUrl:  "http://localhost:7000/assets/javascripts/angular/newProjectModal.html",
        scope: false,
        bindToController: {
            businessId: '=',
            projects: '='
        },
        controller: NewProjectController,
        controllerAs: 'newProjectController'

    }
}

app.controller('newProjectController', [NewProjectController]);
function NewProjectController(ProjectsFactory) {
    var newProjectController = this;
    newProjectController.formData = {};

    newProjectController.createNew = function () {
        newProject()
    };

    function newProject() {
        var newProject = {};
        newProject = newProjectController.formData;
        newProject.businessId = newProjectController.businessId;

        ProjectsFactory.addProject(newProject, function mySuccess() {
            refresh(newProjectController.businessId);
            alerts.autoCloseAlert('success-message', 'New Project has been created', 'Awesome!');
        }, function myError() {
            alerts.autoCloseAlert('success-message', 'Error Creating new project', 'Please try again!');
        });
    }

    function refresh(businessId) {
        newProjectController.formData = {};
        allProjects(businessId);
    }

    function allProjects(businessId) {
        ProjectsFactory.getAllProjects(businessId,
            function mySuccess (response) { newProjectController.projects = response.data.data; },
            function myError (response) { console.log(response.statusText) });
    }

}