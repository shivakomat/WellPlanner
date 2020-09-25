app.factory('BudgetFactory', function TasksFactory ($http) {
    var getAllBreakDowns = function (businessId, projectId, successFunction, errorFunction) {
        $http({method: 'GET', url: '/businesses/'+ businessId + "/projects/" + projectId + "/budget-breakdowns"}).then(successFunction, errorFunction)
    };

    var addBreakDownList = function (breakDownList, successFunction, errorFunction) {
        $http({method: 'POST', url: '/businesses/projects/budget-breakdowns', data: breakDownList}).then(successFunction, errorFunction);
    };

    var deleteBreakDownListBy = function (projectId, businessId, breakDownListId, successFunction, errorFunction) {
        $http({method: 'DELETE', url: '/businesses/' + businessId + '/projects/' + projectId + '/budget-breakdowns/' + breakDownListId}).then(successFunction, errorFunction);
    };

    // var updateTaskBy = function (updatedTask, successFunction, errorFunction) {
    //     $http({method: 'POST', url: '/businesses/projects/tasks/update', data: updatedTask}).then(successFunction, errorFunction);
    // };

    return {
        allBreakdowns: getAllBreakDowns,
        addBreakDownList: addBreakDownList,
        deleteBreakDownListBy: deleteBreakDownListBy
        // updateTaskBy: updateTaskBy
    }
});