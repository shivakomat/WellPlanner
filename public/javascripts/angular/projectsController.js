app.controller('projectsController', function ProjectsController (ProjectsFactory, $scope) {
    var projectsController = this;

    projectsController.projects = [];
    projectsController.projectsHtml = "";
    projectsController.isLoaded = false;

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
                projectsController.isLoaded = true;
            }, function myError (response) {
                console.log(response.statusText)
        });
    }
});