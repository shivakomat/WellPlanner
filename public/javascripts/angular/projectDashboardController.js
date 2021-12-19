app.controller('projectDashboardController', function(TasksFactory, ProjectsFactory) {

    var projectDashboardController = this;

    projectDashboardController.totalCompletedTasks = 0;
    projectDashboardController.totalUnCompletedTasks = 0;
    projectDashboardController.projectInfo = {};


    projectDashboardController.init = function (businessId, projectId) {
        setTotalTasks(businessId, projectId);
        setProjectInfo(projectId, businessId);
    };


    function setProjectInfo(projectId, businessId) {
        ProjectsFactory.getProject(projectId, businessId, function mySuccess (response) {
            projectDashboardController.projectInfo = response.data.data;
        }, function myError (response) {
            projectDashboardController.projectInfo = {};
        });
    }


    function setTotalTasks(businessId, projectId) {
        TasksFactory.allTasks(businessId, projectId,
            function mySuccess (response) {
                var tasks = response.data.data;
                tasks.forEach(myFunction);
                function myFunction(task, index) {
                    if(task.is_completed === true) {
                        projectDashboardController.totalCompletedTasks ++;
                    } else {
                        projectDashboardController.totalUnCompletedTasks ++;
                    }
                }
            }, function myError (response) {
                console.log(response.statusText);
                projectDashboardController.totalCompletedTasks = 0;
                projectDashboardController.totalUnCompletedTasks = 0;
            });
    }

});