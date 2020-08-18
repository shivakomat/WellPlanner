app.factory('ClientsFactory', function ProjectsFactory ($http) {
    var getAllClients = function (businessId, successFunction, errorFunction) {
        $http({method: 'GET', url: '/businesses/clients/' + businessId}).then(successFunction, errorFunction)
    };

    var addClient = function (newClient, successFunction, errorFunction) {
        $http({method: 'POST', url: '/businesses/clients', data: newClient}).then(successFunction, errorFunction);
    };

    var deleteClientBy = function (clientId, businessId, successFunction, errorFunction) {
        $http({method: 'DELETE', url: '/businesses/' + businessId + '/clients/' + clientId}).then(successFunction, errorFunction);
    };

    var updateClientBy = function (updatedClient, successFunction, errorFunction) {
        $http({method: 'POST', url: '/businesses/clients/update', data: updatedClient}).then(successFunction, errorFunction);
    };


    return {
        getAllClients: getAllClients,
        addClient: addClient,
        deleteClientBy: deleteClientBy,
        updateClientBy: updateClientBy
    }
});