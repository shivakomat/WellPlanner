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

app.controller('newTaskListModalController', [NewTaskListModalController]);
function NewTaskListModalController($http) {
    var newTaskListModalController = this;

    newTaskListModalController.formData = {};

    newTaskListModalController.createNew = function () {
        console.log("create new task list button clicked");
        newTaskList()
    };

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