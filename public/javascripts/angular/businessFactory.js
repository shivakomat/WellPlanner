app.factory('BusinessFactory', function BusinessFactory ($http) {
    var getBusiness = function (businessId, successFunction, errorFunction) {
        $http({method: 'GET', url: '/businesses/' + businessId}).then(successFunction, errorFunction)
    };


    return {
        getBusiness: getBusiness
    }
});