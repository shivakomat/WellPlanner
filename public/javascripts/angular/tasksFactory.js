app.factory('TasksFactory', function TasksFactory ($http) {
    var getAllTasks = function (businessId, projectId, successFunction, errorFunction) {
        $http({method: 'GET', url: '/businesses/'+ businessId + "/projects/" + projectId + "/tasks"}).then(successFunction, errorFunction)
    };

    var addTask = function (taskList, successFunction, errorFunction) {
        $http({method: 'POST', url: '/businesses/projects/tasks', data: taskList}).then(successFunction, errorFunction);
    };

    var addTaskItem = function (taskItem, successFunction, errorFunction) {
        $http({method: 'POST', url: '/businesses/projects/tasks/taskItems', data: taskItem}).then(successFunction, errorFunction);
    };

    var getTaskItemsByTask = function (businessId, projectId, taskId, successFunction, errorFunction) {
        $http({method: 'GET', url: '/businesses/'+ businessId + "/projects/" + projectId + "/tasks/" + taskId + "/taskItems"}).then(successFunction, errorFunction);
    };

    var deleteTaskBy = function (projectId, businessId, taskId, successFunction, errorFunction) {
        $http({method: 'DELETE', url: '/businesses/' + businessId + '/projects/' + projectId + '/tasks/' + taskId}).then(successFunction, errorFunction);
    };

    var deleteTaskItemBy = function (taskItemId, taskId, projectId, businessId, successFunction, errorFunction) {
        $http({method: 'DELETE', url: '/businesses/' + businessId + '/projects/' + projectId + '/tasks/' + taskId + '/taskItems/' + taskItemId}).then(successFunction, errorFunction);
    };

    var updateTaskBy = function (updatedTask, successFunction, errorFunction) {
        $http({method: 'POST', url: '/businesses/projects/tasks/update', data: updatedTask}).then(successFunction, errorFunction);
    };

    var getTaskCommentsByTask = function (businessId, projectId, taskId, successFunction, errorFunction) {
        $http({method: 'GET', url: '/businesses/'+ businessId + "/projects/" + projectId + "/tasks/" + taskId + "/taskComments"}).then(successFunction, errorFunction);
    };

    var addTaskComment = function (comment, successFunction, errorFunction) {
        $http({method: 'POST', url: '/businesses/projects/tasks/taskComments', data: comment}).then(successFunction, errorFunction);
    };

    var deleteTaskComment = function (projectId, businessId, taskId, taskCommentId, successFunction, errorFunction) {
        $http({method: 'DELETE', url: '/businesses/' + businessId + '/projects/' + projectId + '/tasks/' + taskId + 'taskComments/' + taskCommentId}).then(successFunction, errorFunction);
    };


    return {
        allTasks: getAllTasks,
        addTask: addTask,
        addTaskItem: addTaskItem,
        deleteTaskBy: deleteTaskBy,
        updateTaskBy: updateTaskBy,
        getTaskItemsByTask: getTaskItemsByTask,
        deleteTaskItemBy: deleteTaskItemBy,
        getTaskCommentsByTask: getTaskCommentsByTask,
        addTaskCommentToTask: addTaskComment,
        deleteTaskComment: deleteTaskComment
    }
});
