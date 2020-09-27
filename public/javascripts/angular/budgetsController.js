app.controller('budgetController', function(BudgetFactory) {
    var budgetController = this;
    budgetController.breakDownsLists = {};

    budgetController.init = function (businessId, projectId) {
        list(businessId, projectId);
    };

    function list(businessId, projectId) {
        BudgetFactory.allBreakdowns(businessId, projectId, function (response) {
                console.log(response.data.data); budgetController.breakDownsLists = response.data.data;
            }, function (response) { console.log(response.statusText);
        })
    }
});

app.directive('newBudgetBreakdownListModal',  [NewBudgetBreakdownListModalDirective]);
function NewBudgetBreakdownListModalDirective() {
    return{
        template:  '<ng-include src="getNewBudgetBreakdownListModalTemplateUrl()"/>',
        scope: false,
        bindToController: {
            businessId: '=',
            projectId: '=',
            breakdownList: '='
        },
        controller: NewBudgetBreakdownListModalController,
        controllerAs: 'newBudgetBreakdownListModalController'

    }
}

app.controller('newBudgetBreakdownListModalController', [NewBudgetBreakdownListModalController]);
function NewBudgetBreakdownListModalController(BudgetFactory, $scope, templates) {
    var newBudgetBreakdownListModalController = this;

    newBudgetBreakdownListModalController.formData = {};

    $scope.getNewBudgetBreakdownListModalTemplateUrl = function () {
        return templates.newBudgetBreakdownListModal;
    };

    newBudgetBreakdownListModalController.createBreakdownList = function () {
        newBreakdownList()
    };

    function newBreakdownList() {
        var breakdownList = {};
        breakdownList = newBudgetBreakdownListModalController.formData;
        breakdownList.business_id = newBudgetBreakdownListModalController.businessId;
        breakdownList.project_id = newBudgetBreakdownListModalController.projectId;
        breakdownList.is_budget_header = true;
        breakdownList.estimate = 0;
        breakdownList.actual = 0;
        breakdownList.parent_budget_id = null;

        BudgetFactory.addBreakDownList(breakdownList, function mySuccess() {
            refresh(newBudgetBreakdownListModalController.businessId, newBudgetBreakdownListModalController.projectId);
            alerts.autoCloseAlert('success-message', 'New list created!!', 'Nice start!');
        }, function myError() {
            alerts.autoCloseAlert('success-message', 'Sorry, unable to create a new list', 'Please try again!');
        });
    }

    function refresh(businessId, projectId) {
        list(businessId, projectId);
        newBudgetBreakdownListModalController.formData = {};
    }

    function list(businessId, projectId) {
        BudgetFactory.allBreakdowns(businessId, projectId, function (response) {
            console.log(response.data.data); newBudgetBreakdownListModalController.breakdownList = response.data.data;
        }, function (response) { console.log(response.statusText);
        })
    }

}

app.directive('newBreakDownModal',  [NewBreakDownModalDirective]);
function NewBreakDownModalDirective() {
    return{
        template:  '<ng-include src="getNewBreakDownModalTemplateUrl()"/>',
        scope: false,
        bindToController: {
            businessId: '=',
            projectId: '=',
            parent: '=',
            currentSubTask: '=',
            tasks: '='
        },
        controller: NewBreakdownModalController,
        controllerAs: 'newBreakdownModalController'
    }
}

app.controller('newBreakdownModalController', [NewBreakdownModalController]);
function NewBreakdownModalController(BudgetFactory, $scope, templates) {
    var newBreakdownModalController = this;

    newBreakdownModalController.formData = {};

    $scope.getNewSubTaskModalTemplateUrl = function () {
        return templates.newSubTaskModal;
    };


    newBreakdownModalController.createNewBreakdownItem = function () {
        newBreakdownItem()
    };

    function newBreakdownItem() {
        var breakdownItem = {};

        breakdownItem = newBreakdownModalController.formData;
        breakdownItem.business_id = newBreakdownModalController.businessId;
        breakdownItem.project_id = newBreakdownModalController.projectId;

        BudgetFactory.addBreakDownList(breakdownItem, function mySuccess() {
            refresh(newBreakdownModalController.businessId, newBreakdownModalController.projectId);
            alerts.autoCloseAlert('success-message', 'New task created!!', 'Good job!');
        }, function myError() {
            alerts.autoCloseAlert('success-message', 'Sorry, unable to create task', 'Please try again!');
        });
    }

    function refresh(businessId, projectId) {
        newBreakdownModalController.formData = {};
        list(businessId, projectId);
    }

    function list(businessId, projectId) {
        BudgetFactory.allBreakdowns(businessId, projectId, function (response) {
            console.log(response.data.data); budgetController.breakDownsLists = response.data.data;
        }, function (response) { console.log(response.statusText);
        })
    }

}

app.directive('deleteBreakdownItemModal',  [DeleteBreakdownListModalDirective]);
function DeleteBreakdownListModalDirective() {
    return{
        template:  '<ng-include src="getDeleteBreakdownModalUrl()"/>',
        scope: false,
        bindToController: {
            businessId: '=',
            projectId: '=',
            tasks: '='
        },
        controller: DeleteBreakdownItemModalController,
        controllerAs: 'deleteBreakdownItemModalController'
    }
}

app.controller('deleteBreakdownItemModalController', [DeleteBreakdownItemModalController]);
function DeleteBreakdownItemModalController(BudgetFactory, $scope, templates) {
    var deleteBreakdownItemModalController = this;
    deleteBreakdownItemModalController.formData = {};
    deleteBreakdownItemModalController.breakDownsLists = [];

    $scope.getDeleteBreakdownModalUrl = function () {
        return templates.deleteTaskListModal;
    };

    deleteBreakdownItemModalController.deleteBreakdownList = function () {
        deleteBreakdownList(deleteBreakdownItemModalController.businessId, deleteBreakdownItemModalController.projectId, deleteBreakdownItemModalController.formData.taskToDelete.parent.id)
    };

    function deleteBreakdownList(businessId, projectId, breakDownListId) {
        BudgetFactory.deleteBreakDownListBy(projectId, businessId, breakDownListId, function mySuccess() {
            refresh(businessId, projectId);
            alerts.autoCloseAlert('success-message', "Task deleted successfully!", "Nice!");
        }, function myError() {
            alerts.autoCloseAlert('success-message', 'Error updating task', 'Please try again!');
        });
    }

    function refresh(businessId, projectId) {
        newBreakdownModalController.formData = {};
        list(businessId, projectId);
    }

    function list(businessId, projectId) {
        BudgetFactory.allBreakdowns(businessId, projectId, function (response) {
            console.log(response.data.data); deleteBreakdownItemModalController.breakDownsLists = response.data.data;
            }, function (response) { console.log(response.statusText);
        })
    }
}
