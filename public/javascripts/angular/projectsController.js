app.controller('projectsController', function ProjectsController (ProjectsFactory, $http) {
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
        ProjectsFactory.deleteProjectBy(projectId, businessId, function mySuccess() {
            refresh(businessId);
            alerts.autoCloseAlert('success-message', 'Project removed!!', '');
        }, function myError() {
            alerts.autoCloseAlert('title-and-text', 'Error deleting project', 'Please try again!');
        });
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