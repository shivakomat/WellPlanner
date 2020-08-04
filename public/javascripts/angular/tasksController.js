'use strict';

app.controller('tasksController', function ($http, $window, $scope) {
    var tasksController = this;

    tasksController.tasks = [];

    function refresh(businessId, projectId) {
        allTasks(businessId, projectId);
    }

    tasksController.getAllTasks = function (businessId) {
        allTasks(businessId)
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
            refresh(businessId, projectId);
            tasksController.tasks = response.data.data;
        }, function myError (response) {
            console.log(response.statusText)
        });
    }
});