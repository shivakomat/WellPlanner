app.factory('BusinessFactory', function BusinessFactory ($http) {
    var getBusiness = function (businessId, successFunction, errorFunction) {
        $http({method: 'GET', url: '/businesses/' + businessId}).then(successFunction, errorFunction)
    };

    var updateBusinessInfo = function (updatedBusiness, successFunction, errorFunction) {
        $http({method: 'POST', url: '/businesses/updateInfo', data: updatedBusiness}).then(successFunction, errorFunction);
    };


    return {
        getBusiness: getBusiness,
        updateBusinessInfo: updateBusinessInfo
    }
});