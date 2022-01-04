app.directive('newProjectModal',  [NewProjectModalDirective]);
function NewProjectModalDirective() {
    return{
        template:  '<ng-include src="getTemplateUrl()"/>',
        scope: false,
        bindToController: {
            clientId: '=',
            businessId: '=',
            projects: '=',
            clients: '='
        },
        controller: NewProjectController,
        controllerAs: 'newProjectController'

    }
}

app.controller('newProjectController', [NewProjectController]);
function NewProjectController(ClientsFactory, ProjectsFactory, $scope, templates) {
    var newProjectController = this;
    newProjectController.formData = {};

    $scope.getTemplateUrl = function () {
        return templates.newProjectModal;
    };


    newProjectController.createNew = function () {
        newProject()
    };

    function clearData() {
        newProjectController.formData = {};
    }

    function newProject() {
        var newProject = {};
        newProject = newProjectController.formData;
        newProject.businessId = newProjectController.businessId;
        newProject.clientId = newProjectController.clientId;
        newProject.budget = newProjectController.clientBudget;
        newProject.eventDate = parseInt(newProjectController.clientEventDate.format('YYYYMMDD'));

        console.log(newProject);

        ProjectsFactory.addProject(newProject, function mySuccess() {
            refresh(newProjectController.businessId);
            clearData();
            alerts.autoCloseAlert('success-message', 'New Project has been created', 'Awesome!');
        }, function myError() {
            clearData();
            alerts.autoCloseAlert('success-message', 'Error Creating new project', 'Please try again!');
        });
    }

    function allClients(businessId) {
        ClientsFactory.getAllClients(businessId, function mySuccess (response) {
            newProjectController.clients = response.data.data;
        }, function myError (response) {
            console.log(response.statusText)
        });
    }

    function refresh(businessId) {
        newProjectController.formData = {};
        allProjects(businessId);
        allClients(businessId);
    }

    function allProjects(businessId) {
        ProjectsFactory.getAllProjects(businessId,
            function mySuccess (response) { newProjectController.projects = response.data.data; },
            function myError (response) { console.log(response.statusText) });
    }

}