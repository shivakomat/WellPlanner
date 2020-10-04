app.controller('budgetController', function(BudgetFactory, ProjectsFactory) {
    var budgetController = this;
    budgetController.breakDownsLists = {};
    budgetController.projectInfo = {};

    budgetController.editBreakdownItem = function (breakdownItem) {
        budgetController.currentBreakdown = breakdownItem
    };

    budgetController.init = function (businessId, projectId) {
        list(businessId, projectId);
        setProjectInfo(projectId, businessId);
    };

    budgetController.newBreakdownItem = function (parent) {
        budgetController.currentParentBreakdown = parent;
    };

    budgetController.deleteBreakdownItem = function (breakdownItem) {
        BudgetFactory.deleteBreakDown(breakdownItem.project_id, breakdownItem.business_id, breakdownItem.id, function mySuccess() {
            budgetController.init(breakdownItem.project_id, breakdownItem.business_id);
            alerts.autoCloseAlert('success-message', 'Breakdown Item Deleted!!', '');
        }, function myError() {
            alerts.autoCloseAlert('title-and-text', 'Error deleting item', 'Please try again!');
        })
    };

    function setProjectInfo(projectId, businessId) {
        ProjectsFactory.getProject(projectId, businessId, function mySuccess (response) {
            budgetController.projectInfo = response.data.data;
        }, function myError (response) {
            console.log(response.statusText);
            budgetController.projectInfo = {};
        });
    }

    function setTotalEstimateAndActual() {
        var p;
        var overallEstimate = 0;
        var overallActual = 0;
        for (p = 0; p < budgetController.breakDownsLists.length; p++) {
            var x;
            var totalEstimated = 0;
            var totalActual = 0;
            for(x = 0; x < budgetController.breakDownsLists[p].subBreakDowns.length; x++) {
                totalEstimated = totalEstimated + budgetController.breakDownsLists[p].subBreakDowns[x].estimate
                totalActual = totalActual + budgetController.breakDownsLists[p].subBreakDowns[x].actual
            }
            budgetController.breakDownsLists[p].totalEstimate =  totalEstimated;
            budgetController.breakDownsLists[p].totalActual =  totalActual;
            overallEstimate = overallEstimate + totalEstimated;
            overallActual = overallActual + totalActual;
        }

        budgetController.breakDownsLists.overallEstimate = overallEstimate;
        budgetController.breakDownsLists.overallActual = overallActual;

    }


    function list(businessId, projectId) {
        BudgetFactory.allBreakdowns(businessId, projectId, function (response) {
                budgetController.breakDownsLists = response.data.data;
                setTotalEstimateAndActual();
                console.log(budgetController.breakDownsLists);
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

app.directive('newBreakdownModal',  [NewBreakdownModalDirective]);
function NewBreakdownModalDirective() {
    return{
        template:  '<ng-include src="getNewBreakdownItemModalTemplateUrl()"/>',
        scope: false,
        bindToController: {
            businessId: '=',
            projectId: '=',
            parent: '=',
            breakdownList: '='
        },
        controller: NewBreakdownModalController,
        controllerAs: 'newBreakdownModalController'
    }
}

app.controller('newBreakdownModalController', [NewBreakdownModalController]);
function NewBreakdownModalController(BudgetFactory, $scope, templates) {
    var newBreakdownModalController = this;

    newBreakdownModalController.formData = {};

    $scope.getNewBreakdownItemModalTemplateUrl = function () {
        return templates.newBreakdownItemModal;
    };

    newBreakdownModalController.createNewBreakdownItem = function () {
        newBreakdownItem()
    };

    function newBreakdownItem() {
        var breakdownItem = {};
        breakdownItem = newBreakdownModalController.formData;
        breakdownItem.business_id = newBreakdownModalController.businessId;
        breakdownItem.project_id = newBreakdownModalController.projectId;
        breakdownItem.parent_budget_id = newBreakdownModalController.parent.id;
        breakdownItem.actual = 0;
        breakdownItem.is_budget_header = false;

        BudgetFactory.addBreakDownList(breakdownItem, function mySuccess() {
            refresh(newBreakdownModalController.businessId, newBreakdownModalController.projectId);
            alerts.autoCloseAlert('success-message', 'New item created!!', 'Good job!');
        }, function myError() {
            alerts.autoCloseAlert('success-message', 'Sorry, unable to create breakdown item', 'Please try again!');
        });
    }

    function refresh(businessId, projectId) {
        newBreakdownModalController.formData = {};
        list(businessId, projectId);
    }

    function setTotalEstimateAndActual() {
        var p;
        for (p = 0; p < newBreakdownModalController.breakdownList.length; p++) {
            var x;
            var totalEstimated = 0;
            var totalActual = 0;
            for(x = 0; x < newBreakdownModalController.breakdownList[p].subBreakDowns.length; x++) {
                totalEstimated = totalEstimated + newBreakdownModalController.breakdownList[p].subBreakDowns[x].estimate
                totalActual = totalActual + newBreakdownModalController.breakdownList[p].subBreakDowns[x].actual
            }
            newBreakdownModalController.breakdownList[p].totalEstimate =  totalEstimated;
            newBreakdownModalController.breakdownList[p].totalActual =  totalActual;
            console.log(newBreakdownModalController.breakdownList[p].totalEstimate);
            console.log(newBreakdownModalController.breakdownList[p].totalActual);
        }

    }

    function list(businessId, projectId) {
        BudgetFactory.allBreakdowns(businessId, projectId, function (response) {
            newBreakdownModalController.breakdownList = response.data.data;
            setTotalEstimateAndActual();
        }, function (response) {
            console.log(response.statusText);
        })
    }

}

app.directive('editBreakdownModal',  [EditBreakDownModalDirective]);
function EditBreakDownModalDirective() {
    return{
        template:  '<ng-include src="getEditBreakdownItemModalTemplateUrl()"/>',
        scope: false,
        bindToController: {
            businessId: '=',
            projectId: '=',
            currentBreakdownItem: '='
        },
        controller: EditBreakdownModalController,
        controllerAs: 'editBreakdownItemModalController'
    }
}

app.controller('editBreakdownItemModalController', [EditBreakdownModalController]);
function EditBreakdownModalController(BudgetFactory, $scope, templates) {
    var editBreakdownItemModalController = this;

    $scope.getEditBreakdownItemModalTemplateUrl = function () {
        return templates.editBreakdownItemModal;
    };

    editBreakdownItemModalController.updateBreakdownItem = function () {
        updateBreakDown(editBreakdownItemModalController.subTask, "Breakdown Item updated!", "Woo hoo!");
    };

    function updateBreakDown(updatedBreakdownItem, msg, msgDesc) {
        BudgetFactory.updateBreakdownItem(updatedBreakdownItem,
            function mySuccess() {
                alerts.autoCloseAlert('success-message', msg, msgDesc);
            }, function myError() {
                alerts.autoCloseAlert('success-message', 'Error updating breakdown item amounts', 'Please try again!');
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

