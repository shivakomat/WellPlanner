app.directive('taskCommentsModal',  [TaskCommentsModalDirective]);
function TaskCommentsModalDirective() {
    return{
        template:  '<ng-include src="getTemplateTaskCommentsUrl()"/>',
        scope: false,
        bindToController: {
            taskComments: '=',
            projectId: '=',
            subTask: '=',
            businessId: '='
        },
        controller: TaskCommentsModalController,
        controllerAs: 'taskCommentsController'

    }
}

app.controller('taskCommentsController', [TaskCommentsModalController]);
function TaskCommentsModalController(TasksFactory, $scope, templates) {

    var taskCommentsController = this;
    taskCommentsController.formData = {};
    taskCommentsController.formData.newComment = "";

    $scope.getTemplateTaskCommentsUrl = function () {
        return templates.taskCommentsModal;
    };

    taskCommentsController.addComment = function () {
        var comment = {};
        comment.comment_text = taskCommentsController.formData.newComment;
        comment.project_id = taskCommentsController.projectId;
        comment.business_id = taskCommentsController.businessId;
        comment.user_created_id = 1;
        comment.task_id = taskCommentsController.subTask.id;

        TasksFactory.addTaskCommentToTask(comment,
            function mySuccess (response) {
                getTaskComments(taskCommentsController.businessId, taskCommentsController.projectId,
                                taskCommentsController.subTask.id);
            },
            function myError (response) {
                console.log(response.statusText)
            }
        )
    };

    function getTaskComments(businessId, projectId, taskId) {
        TasksFactory.getTaskCommentsByTask(businessId, projectId, taskId,
            function mySuccess (response) {
                taskCommentsController.taskComments  = response.data.data;
                taskCommentsController.formData = {};
            },
            function myError (response) { console.log(response.statusText) }
        );
    }
}