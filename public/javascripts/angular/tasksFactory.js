app.factory('TasksFactory', function TasksFactory ($http) {
    var getAllTasks = function (businessId, projectId, successFunction, errorFunction) {
        $http({method: 'GET', url: '/businesses/'+ businessId + "/projects/" + projectId + "/tasks"}).then(successFunction, errorFunction)
    };

    var addTask = function (taskList, successFunction, errorFunction) {
        $http({method: 'POST', url: '/businesses/projects/tasks', data: taskList}).then(successFunction, errorFunction);
    };

    var deleteTaskBy = function (projectId, businessId, taskId, successFunction, errorFunction) {
        $http({method: 'DELETE', url: '/businesses/' + businessId + '/projects/' + projectId + '/tasks/' + taskId}).then(successFunction, errorFunction);
    };

    var updateTaskBy = function (updatedTask, successFunction, errorFunction) {
        $http({method: 'POST', url: '/businesses/projects/tasks/update', data: updatedTask}).then(successFunction, errorFunction);
    };

    return {
        allTasks: getAllTasks,
        addTask: addTask,
        deleteTaskBy: deleteTaskBy,
        updateTaskBy: updateTaskBy
    }
});