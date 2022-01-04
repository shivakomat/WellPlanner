app.factory('BudgetFactory', function TasksFactory ($http) {
    var getAllBreakDowns = function (businessId, projectId, successFunction, errorFunction) {
        $http({method: 'GET', url: '/businesses/'+ businessId + "/projects/" + projectId + "/budget-breakdowns"}).then(successFunction, errorFunction)
    };

    var addBreakDownList = function (breakDownList, successFunction, errorFunction) {
        $http({method: 'POST', url: '/businesses/projects/budget-breakdowns', data: breakDownList}).then(successFunction, errorFunction);
    };

    var deleteBreakDown = function (projectId, businessId, breakdownId, successFunction, errorFunction) {
        $http({method: 'DELETE', url: '/businesses/' + businessId + '/projects/' + projectId + '/budget-breakdowns/' + breakdownId}).then(successFunction, errorFunction);
    };

    var updateBreakdownItemBy = function (updatedBreakdown, successFunction, errorFunction) {
        $http({method: 'POST', url: '/businesses/projects/budget-breakdowns/update', data: updatedBreakdown}).then(successFunction, errorFunction);
    };

    var addPayment = function (newPayment, successFunction, errorFunction) {
        $http({method: 'POST', url: '/businesses/projects/budget-breakdowns/payments', data: newPayment}).then(successFunction, errorFunction);
    };

    var deletePayment = function (projectId, businessId, breakdownId, paymentId, successFunction, errorFunction) {
        $http({method: 'DELETE', url: '/businesses/' + businessId + '/projects/' + projectId + '/budget-breakdowns/' + breakdownId + '/payments/' + paymentId}).then(successFunction, errorFunction);
    };

    var paymentsByProject = function (projectId, businessId, successFunction, errorFunction) {
        $http({method: 'GET', url: '/pages/' + businessId + "/projects/" + projectId + "/payments"}).then(successFunction, errorFunction)
    };

    return {
        allBreakdowns: getAllBreakDowns,
        addBreakDownList: addBreakDownList,
        deleteBreakDown: deleteBreakDown,
        updateBreakdownItemBy: updateBreakdownItemBy,
        addPayment: addPayment,
        deletePayment: deletePayment,
        paymentsByProject: paymentsByProject
    }
});