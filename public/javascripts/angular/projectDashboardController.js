app.controller('projectDashboardController', function(TasksFactory, ProjectsFactory) {

    var projectDashboardController = this;

    projectDashboardController.totalCompletedTasks = 0;
    projectDashboardController.totalUnCompletedTasks = 0;
    projectDashboardController.projectInfo = {};


    projectDashboardController.init = function (businessId, projectId) {
        projectDashboardController.totalCompletedTasks = 0;
        projectDashboardController.totalTasks = 0;
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
                for(var x = 0; x < tasks.length; x++) {
                    for(var y = 0; y < tasks[x].subTasks.length; y++) {
                        var currSubTask = tasks[x].subTasks[y];
                        projectDashboardController.totalTasks ++;
                        if(currSubTask.is_completed === true) {
                            projectDashboardController.totalCompletedTasks ++;
                        }
                    }
                }
            }, function myError (response) {
                console.log(response.statusText);
                projectDashboardController.totalCompletedTasks = 0;
                projectDashboardController.totalUnCompletedTasks = 0;
            });
    }

});