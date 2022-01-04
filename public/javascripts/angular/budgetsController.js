app.controller('budgetController', function(BudgetFactory, ProjectsFactory) {
    var budgetController = this;
    budgetController.breakDownsLists = [];
    budgetController.projectInfo = {};
    budgetController.isLoaded = false;
    budgetController.currentPayments = [];

    budgetController.allPayments = [];

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
            budgetController.init(breakdownItem.business_id, breakdownItem.project_id);
            alerts.autoCloseAlert('success-message', 'Breakdown Item Deleted!!', 'Perfect');
        }, function myError() {
            alerts.autoCloseAlert('title-and-text', 'Error deleting item', 'Please try again!');
        })
    };

    budgetController.setCurrentPayments = function (payments, breakDownListId, breakDownItemId, breakDownsLists) {
        budgetController.currentPayments =  payments;
        budgetController.currentBreakDownItemId =  breakDownItemId;
        budgetController.currentBreakdownLists = breakDownsLists;
        budgetController.currentBreakdownListId = breakDownListId;
    };

    function setProjectInfo(projectId, businessId) {
        ProjectsFactory.getProject(projectId, businessId, function mySuccess (response) {
            budgetController.projectInfo = response.data.data;
            budgetController.isLoaded = true;
        }, function myError (response) {
            budgetController.projectInfo = {};
        });
    }

    function list(businessId, projectId) {
        BudgetFactory.allBreakdowns(businessId, projectId, function (response) {
            budgetController.breakDownsLists  = response.data.data;
            budgetController.breakDownsLists = calcTotalEstimateAndActual(budgetController.breakDownsLists);
            budgetController.allPayments = processForPayments(budgetController.breakDownsLists);
        }, function (response) { console.log(response.statusText);
        })
    }


});

function processForPayments(breakdownList) {
    var payments = [];
    for (var x = 0; x < breakdownList.length; x++) {
        console.log(breakdownList[x]);
        for (var y = 0; y < breakdownList[x].subBreakDowns.length; y++) {
            for (var z = 0; z < breakdownList[x].subBreakDowns[y].payments.length; z++) {
                console.log(breakdownList[x].subBreakDowns[y].breakdownItem.title);
                payments[z] = {};
                payments[z].main_title = breakdownList[x].breakDown.title;
                payments[z].title = breakdownList[x].subBreakDowns[y].breakdownItem.title;
                payments[z].payment_amount = breakdownList[x].subBreakDowns[y].payments[z].payment_amount;
                payments[z].payment_date = breakdownList[x].subBreakDowns[y].payments[z].payment_date;
                payments[z].payment_date_display = moment(breakdownList[x].subBreakDowns[y].payments[z].payment_date, "YYYYMMDD").format("MMM-DD-YYYY");
            }
        }
    }
    return payments;
}

function calcTotalEstimateAndActual(breakdownList) {
    var p;
    var overallEstimate = 0;
    var overallActual = 0;
    var overallAmountPaid = 0;
    for (p = 0; p < breakdownList.length; p++) {
        var x;
        var totalEstimated = 0;
        var totalActual = 0;
        var totalPaid = 0;
        for(x = 0; x < breakdownList[p].subBreakDowns.length; x++) {
            totalEstimated = totalEstimated + breakdownList[p].subBreakDowns[x].breakdownItem.estimate;
            totalActual = totalActual + breakdownList[p].subBreakDowns[x].breakdownItem.actual;
            var totalAmountPaid = 0;
            for(j = 0; j < breakdownList[p].subBreakDowns[x].payments.length; j++) {
                totalAmountPaid = breakdownList[p].subBreakDowns[x].payments[j].payment_amount + totalAmountPaid;
                breakdownList[p].subBreakDowns[x].payments[j].payment_date_display = moment(breakdownList[p].subBreakDowns[x].payments[j].payment_date, "YYYYMMDD").format("MMM-DD-YYYY");
            }
            breakdownList[p].subBreakDowns[x].breakdownItem.amountPaid = totalAmountPaid;
            totalPaid = totalAmountPaid + totalPaid;
        }
        breakdownList[p].totalEstimate =  totalEstimated;
        breakdownList[p].totalActual =  totalActual;
        breakdownList[p].totalPaid =  totalPaid;
        breakdownList[p].totalBalance =  totalActual - totalPaid;
        overallEstimate = overallEstimate + totalEstimated;
        overallActual = overallActual + totalActual;
        overallAmountPaid = totalPaid + overallAmountPaid;
    }
    breakdownList.overallEstimate = overallEstimate;
    breakdownList.overallActual = overallActual;
    breakdownList.totalSavings = breakdownList.overallEstimate - breakdownList.overallActual;
    breakdownList.overallAmountPaid = overallAmountPaid;
    breakdownList.overallAmountUnPaid = overallActual - overallAmountPaid;
    return breakdownList;
}

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
            newBudgetBreakdownListModalController.breakdownList = response.data.data;
            newBudgetBreakdownListModalController.breakdownList = calcTotalEstimateAndActual(newBudgetBreakdownListModalController.breakdownList);
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

    function list(businessId, projectId) {
        BudgetFactory.allBreakdowns(businessId, projectId, function (response) {
            newBreakdownModalController.breakdownList = response.data.data;
            newBreakdownModalController.breakdownList = calcTotalEstimateAndActual(newBreakdownModalController.breakdownList);
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
            currentBreakdownItem: '=',
            breakdownList: '='
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

    editBreakdownItemModalController.close = function () {
        list(editBreakdownItemModalController.businessId, editBreakdownItemModalController.projectId);
    };

    editBreakdownItemModalController.updateItem = function () {
        updateBreakDown(editBreakdownItemModalController.currentBreakdownItem, "Breakdown Item updated!", "Woo hoo!");
    };

    function updateBreakDown(updatedBreakdownItem, msg, msgDesc) {
        BudgetFactory.updateBreakdownItemBy(updatedBreakdownItem,
            function mySuccess() {
                alerts.autoCloseAlert('success-message', msg, msgDesc);
                list(editBreakdownItemModalController.businessId, editBreakdownItemModalController.projectId);
            }, function myError() {
                alerts.autoCloseAlert('success-message', 'Error updating breakdown item amounts', 'Please try again!');
            })
    }

    function list(businessId, projectId) {
        BudgetFactory.allBreakdowns(businessId, projectId, function (response) {
            editBreakdownItemModalController.breakdownList = response.data.data;
            editBreakdownItemModalController.breakdownList = calcTotalEstimateAndActual(editBreakdownItemModalController.breakdownList);
        }, function (response) {
            console.log(response.statusText);
        })
    }
}

app.directive('deleteBreakdownsListModal',  [DeleteBreakdownListModalDirective]);
function DeleteBreakdownListModalDirective() {
    return{
        template:  '<ng-include src="getDeleteBreakdownsListModalTemplateUrl()"/>',
        scope: false,
        bindToController: {
            businessId: '=',
            projectId: '=',
            breakdownsLists: '='
        },
        controller: DeleteBreakdownsListModalController,
        controllerAs: 'deleteBreakdownsListModalController'
    }
}

app.controller('deleteBreakdownsListModalController', [DeleteBreakdownsListModalController]);
function DeleteBreakdownsListModalController(BudgetFactory, $scope, templates) {
    var deleteBreakdownsListModalController = this;
    deleteBreakdownsListModalController.formData = {};
    deleteBreakdownsListModalController.breakdownsLists = [];


    $scope.getDeleteBreakdownsListModalTemplateUrl = function () {
        return templates.deleteBreakdownsListModal;
    };

    deleteBreakdownsListModalController.deleteBreakdownList = function () {
        deleteBreakdownList(deleteBreakdownsListModalController.businessId, deleteBreakdownsListModalController.projectId, deleteBreakdownsListModalController.formData.breakdownListToDelete.breakDown.id)
    };

    function deleteBreakdownList(businessId, projectId, breakDownListId) {
        BudgetFactory.deleteBreakDown(projectId, businessId, breakDownListId, function mySuccess() {
            refresh(businessId, projectId);
            alerts.autoCloseAlert('success-message', "Task Breakdown List Deleted Successfully!", "Nice!");
        }, function myError() {
            alerts.autoCloseAlert('success-message', 'Error updating task', 'Please try again!');
        });
    }

    function refresh(businessId, projectId) {
        deleteBreakdownsListModalController.formData = {};
        list(businessId, projectId);
    }

    function list(businessId, projectId) {
        BudgetFactory.allBreakdowns(businessId, projectId, function (response) {
            deleteBreakdownsListModalController.breakdownsLists  = response.data.data;
            deleteBreakdownsListModalController.breakdownsLists = calcTotalEstimateAndActual(deleteBreakdownsListModalController.breakdownsLists);
        }, function (response) { console.log(response.statusText);
        })
    }
}
