app.controller('tasksController', function ($http) {
    var tasksController = this;

    console.log("Intiatianated tasks controller");

    tasksController.tasks = [];

    function refresh(businessId, projectId) {
        allTasks(businessId, projectId);
    }

    tasksController.getAllTasks = function (projectId, businessId) {
        console.log("Inside tasks");
        allTasks(businessId, projectId)
    };

    tasksController.removeTask = function (projectId, businessId) {
        deleteTaskBy(projectId, businessId);
    };

    function deleteTaskBy(projectId, businessId, taskId) {
        $http({
            method: 'DELETE',
            url: '/businesses/' + businessId + '/projects/' + projectId + '/tasks/' + taskId
        }).then(function mySuccess() {
            refresh(businessId);
            alerts.autoCloseAlert('success-message', 'Project removed!!', '');
        }, function myError() {
            alerts.autoCloseAlert('title-and-text', 'Error deleting project', 'Please try again!');
        })
    }

    function allTasks(businessId, projectId) {
        $http({
            method: 'GET',
        url: '/businesses/'+ businessId + "/projects/" + projectId + "/tasks"
        }).then(function mySuccess (response) {
            tasksController.tasks = response.data.data;
        }, function myError (response) {
            console.log(response.statusText)
        });
    }
});