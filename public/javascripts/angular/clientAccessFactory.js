app.factory('ClientAccessFactory', function ClientAccessFactory ($http) {
    var getAccess = function (projectId, businessId, successFunction, errorFunction) {
        $http({method: 'GET', url: '/businesses/'+ businessId + '/projects/' + projectId + '/clientAccess' }).then(successFunction, errorFunction)
    };

    var addClientAccess = function (access, successFunction, errorFunction) {
        $http({method: 'POST', url: '/businesses/projects/clientAccess ', data: access}).then(successFunction, errorFunction);
    };

    var updateClientAccess = function (access, successFunction, errorFunction) {
        $http({method: 'POST', url: '/businesses/projects/clientAccess/update ', data: access}).then(successFunction, errorFunction);
    };

    var loginClient = function (loginInfo, successFunction, errorFunction) {
        $http({method: 'POST', url: '/client-accesses/login', data: loginInfo}).then(successFunction, errorFunction);
    };

    return {
        getAccess: getAccess,
        addClientAccess: addClientAccess,
        updateClientAccess: updateClientAccess,
        loginClient: loginClient
    }
});