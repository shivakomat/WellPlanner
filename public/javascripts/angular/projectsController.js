app.controller('projectsController', function ProjectsController (ProjectsFactory) {
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
                for (var i=0; i < projectsController.projects.length; i++) {
                    projectsController.projects[i].event_date_display = moment(projectsController.projects[i].event_date, "YYYYMMDD").format("MMM-DD-YYYY");
                    projectsController.projects[i].created_date_display = moment(projectsController.projects[i].created_date, "YYYYMMDD").format("MMM-DD-YYYY");
                }
                projectsController.isLoaded = true;
            }, function myError (response) {
                console.log(response.statusText)
        });
    }
});