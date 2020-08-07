app.controller('tasksController', function ($http) {
    var tasksController = this;

    tasksController.tasks = [];
    tasksController.currentParentTask = {};
    tasksController.currentSubTask = {};

    function refresh(businessId, projectId) {
        allTasks(businessId, projectId);
    }

    tasksController.newSubtask = function(parentTask) {
        tasksController.currentParentTask = parentTask;
    };

    tasksController.editTask = function (subTask) {
        tasksController.currentSubTask = subTask;
    };

    tasksController.getAllTasks = function (projectId, businessId) {
        allTasks(businessId, projectId)
    };

    tasksController.removeTask = function (projectId, businessId, taskId) {
        deleteTaskBy(projectId, businessId, taskId);
    };

    function deleteTaskBy(projectId, businessId, taskId) {
        $http({
            method: 'DELETE',
            url: '/businesses/' + businessId + '/projects/' + projectId + '/tasks/' + taskId
        }).then(function mySuccess() {
            refresh(businessId, projectId);
            alerts.autoCloseAlert('success-message', 'Task removed!!', '');
        }, function myError() {
            alerts.autoCloseAlert('title-and-text', 'Error deleting task', 'Please try again!');
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

app.directive('newTaskListModal',  [NewTaskListModalDirective]);
function NewTaskListModalDirective() {
    return{
        templateUrl:  "http://localhost:7000/assets/javascripts/angular/newTaskListModal.html",
        scope: {},
        bindToController: {
            businessId: '=',
            projectId: '='
        },
        controller: NewTaskListModalController,
        controllerAs: 'newTaskListModalController'

    }
}

app.directive('newSubTaskModal',  [NewSubTaskListModalDirective]);
function NewSubTaskListModalDirective() {
    return{
        templateUrl:  "http://localhost:7000/assets/javascripts/angular/newSubTaskModal.html",
        scope: false,
        bindToController: {
            businessId: '=',
            projectId: '=',
            parent: '=',
            currentSubTask: '='
        },
        controller: NewTaskListModalController,
        controllerAs: 'newTaskListModalController'
    }
}

app.controller('newTaskListModalController', [NewTaskListModalController]);
function NewTaskListModalController($http) {
    var newTaskListModalController = this;

    newTaskListModalController.formData = {};

    newTaskListModalController.createNewTaskList = function () {
        newTaskList()
    };

    newTaskListModalController.createNewSubTask = function () {
        newSubTask()
    };

    function newSubTask() {
        var subTask = {};
        
        console.log(newTaskListModalController.parent);

        subTask = newTaskListModalController.formData;
        subTask.business_id = newTaskListModalController.businessId;
        subTask.project_id = newTaskListModalController.projectId;
        subTask.parent_task_id = newTaskListModalController.parent.id;
        subTask.is_category = false;
        subTask.title = "";
        subTask.notes = "";


        $http({
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            url: '/businesses/projects/tasks',
            data: subTask,
        }).then(function mySuccess() {
            alerts.autoCloseAlert('success-message', 'New Sub Task has been created', 'Awesome!');
        }, function myError() {
            alerts.autoCloseAlert('success-message', 'Error Creating new sub task', 'Please try again!');
        })
    }

    function newTaskList() {
        var taskList = {};
        taskList = newTaskListModalController.formData;
        taskList.business_id = newTaskListModalController.businessId;
        taskList.project_id = newTaskListModalController.projectId;
        taskList.parent_task_id = null;
        taskList.is_category = true;
        taskList.description = "";
        taskList.notes = "";

        $http({
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            url: '/businesses/projects/tasks',
            data: taskList,
        }).then(function mySuccess() {
            alerts.autoCloseAlert('success-message', 'New Task List has been created', 'Awesome!');
        }, function myError() {
            alerts.autoCloseAlert('success-message', 'Error Creating new task list', 'Please try again!');
        })
    }

}