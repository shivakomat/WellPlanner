app.controller('tasksController', function (TasksFactory, $http) {
    var tasksController = this;

    tasksController.tasks = [];
    tasksController.currentParentTask = {};
    tasksController.currentSubTask = {};

    function refresh(businessId, projectId) {
        allTasks(businessId, projectId);
    }

    tasksController.completeTask = function (subTask) {
        if(subTask.is_completed === true) {
            updateTask(subTask, "Task mark completed!!", "Good job!");
        } else {
            updateTask(subTask, "Task marked not completed!!", "Uh oh!");
        }
    };

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

    function updateTask(updatedSubTask, msg, msgDesc) {
        TasksFactory.updateTaskBy(updatedSubTask, function mySuccess() {
                refresh(updatedSubTask.business_id, updatedSubTask.project_id);
                alerts.autoCloseAlert('success-message', msg, msgDesc);
            }, function myError() {
                alerts.autoCloseAlert('success-message', 'Error updating task', 'Please try again!');
            });
    }

    function deleteTaskBy(projectId, businessId, taskId) {
        TasksFactory.deleteTaskBy(projectId, businessId, taskId, function mySuccess() {
            refresh(businessId, projectId);
            alerts.autoCloseAlert('success-message', 'Task Deleted!!', '');
        }, function myError() {
            alerts.autoCloseAlert('title-and-text', 'Error deleting task', 'Please try again!');
        })
    }

    function allTasks(businessId, projectId) {
        TasksFactory.allTasks(businessId, projectId,
            function mySuccess (response) { tasksController.tasks = response.data.data;},
            function myError (response) { console.log(response.statusText) }
        )
    }
});



app.directive('newTaskListModal',  [NewTaskListModalDirective]);
function NewTaskListModalDirective() {
    return{
        template:  '<ng-include src="getNewTaskListModalTemplateUrl()"/>',
        scope: false,
        bindToController: {
            businessId: '=',
            projectId: '=',
            tasks: '='
        },
        controller: NewTaskListModalController,
        controllerAs: 'newTaskListModalController'

    }
}

app.directive('newSubTaskModal',  [NewSubTaskListModalDirective]);
function NewSubTaskListModalDirective() {
    return{
        template:  '<ng-include src="getNewSubTaskModalTemplateUrl()"/>',
        scope: false,
        bindToController: {
            businessId: '=',
            projectId: '=',
            parent: '=',
            currentSubTask: '=',
            tasks: '='
        },
        controller: NewSubTaskListModalController,
        controllerAs: 'newSubTaskListModalController'
    }
}

app.directive('deleteTaskListModal',  [DeleteTaskListModalDirective]);
function DeleteTaskListModalDirective() {
    return{
        template:  '<ng-include src="getDeleteTaskListTemplateUrl()"/>',
        scope: false,
        bindToController: {
            businessId: '=',
            projectId: '=',
            tasks: '='
        },
        controller: DeleteTaskModalController,
        controllerAs: 'deleteTaskModalController'
    }
}

app.controller('deleteTaskModalController', [DeleteTaskModalController]);
function DeleteTaskModalController(TasksFactory, $scope, templates) {
    var deleteTaskModalController = this;
    deleteTaskModalController.formData = {};

    $scope.getDeleteTaskListTemplateUrl = function () {
        return templates.deleteTaskListModal;
    };


    deleteTaskModalController.deleteTaskList = function () {
        deleteTaskList(deleteTaskModalController.businessId, deleteTaskModalController.projectId, deleteTaskModalController.formData.taskToDelete.parent.id)
    };

    function deleteTaskList(businessId, projectId, taskId) {
        TasksFactory.deleteTaskBy(projectId, businessId, taskId, function mySuccess() {
            refresh(businessId, projectId);
            alerts.autoCloseAlert('success-message', "Task deleted successfully", "Nice!");
        }, function myError() {
            alerts.autoCloseAlert('success-message', 'Error updating task', 'Please try again!');
        });
    }

    function refresh(businessId, projectId) {
        allTasks(businessId, projectId);
    }

    function allTasks(businessId, projectId) {
        TasksFactory.allTasks(businessId, projectId,
            function mySuccess (response) { deleteTaskModalController.tasks = response.data.data; },
            function myError (response) { console.log(response.statusText) }
        )
    }
}

app.directive('editSubTaskModal',  [EditSubTaskModalDirective]);
function EditSubTaskModalDirective() {
    return{
        template:  '<ng-include src="getEditSubTaskModalTemplateUrl()"/>',
        scope: false,
        bindToController: {
            businessId: '=',
            projectId: '=',
            parent: '=',
            subTask: '='
        },
        controller: EditTaskModalController,
        controllerAs: 'editTaskModalController'
    }
}

app.controller('editTaskModalController', [EditTaskModalController]);
function EditTaskModalController(TasksFactory, $scope, templates) {
    var editTaskModalController = this;

    $scope.getEditSubTaskModalTemplateUrl = function () {
        return templates.editTaskModal;
    };


    editTaskModalController.updateTask = function () {
        updateTask(editTaskModalController.subTask, "Task updated!", "Woo hoo!");
    };

    function updateTask(updatedSubTask, msg, msgDesc) {
        console.log(updatedSubTask);
        TasksFactory.updateTaskBy(updatedSubTask,
           function mySuccess() {
            alerts.autoCloseAlert('success-message', msg, msgDesc);
        }, function myError() {
            alerts.autoCloseAlert('success-message', 'Error updating task', 'Please try again!');
        })
    }

}

app.controller('newTaskListModalController', [NewTaskListModalController]);
function NewTaskListModalController(TasksFactory, $scope, templates) {
    var newTaskListModalController = this;

    newTaskListModalController.formData = {};

    $scope.getNewTaskListModalTemplateUrl = function () {
        return templates.newTaskListModal;
    };


    newTaskListModalController.createNewTaskList = function () {
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
        taskList.is_completed = false;

        TasksFactory.addTask(taskList, function mySuccess() {
            refresh(newTaskListModalController.businessId, newTaskListModalController.projectId);
            alerts.autoCloseAlert('success-message', 'New list created!!', 'Nice start!');
        }, function myError() {
            alerts.autoCloseAlert('success-message', 'Sorry, unable to create a new list', 'Please try again!');
        });
    }

    function refresh(businessId, projectId) {
        allTasks(businessId, projectId);
        newTaskListModalController.formData = {};
    }

    function allTasks(businessId, projectId) {
        TasksFactory.allTasks(businessId, projectId,
            function mySuccess (response) { newTaskListModalController.tasks = response.data.data; },
            function myError (response) { console.log(response.statusText) }
        )
    }

}

app.controller('newSubTaskListModalController', [NewSubTaskListModalController]);
function NewSubTaskListModalController(TasksFactory, $scope, templates) {
    var newSubTaskListModalController = this;

    newSubTaskListModalController.formData = {};

    $scope.getNewSubTaskModalTemplateUrl = function () {
        return templates.newSubTaskModal;
    };


    newSubTaskListModalController.createNewSubTask = function () {
        newSubTask()
    };

    function newSubTask() {
        var subTask = {};

        subTask = newSubTaskListModalController.formData;
        subTask.business_id = newSubTaskListModalController.businessId;
        subTask.project_id = newSubTaskListModalController.projectId;
        subTask.parent_task_id = newSubTaskListModalController.parent.id;
        subTask.is_category = false;
        subTask.title = "";
        subTask.notes = "";
        subTask.is_completed = false;

        TasksFactory.addTask(subTask, function mySuccess() {
            refresh(newSubTaskListModalController.businessId, newSubTaskListModalController.projectId);
            alerts.autoCloseAlert('success-message', 'New task created!!', 'Good job!');
        }, function myError() {
            alerts.autoCloseAlert('success-message', 'Sorry, unable to create task', 'Please try again!');
        });
    }

    function refresh(businessId, projectId) {
        newSubTaskListModalController.formData = {};
        allTasks(businessId, projectId);
    }

    function allTasks(businessId, projectId) {
        TasksFactory.allTasks(businessId, projectId,
            function mySuccess (response) { newSubTaskListModalController.tasks = response.data.data; },
            function myError (response) { console.log(response.statusText) }
        )
    }

}