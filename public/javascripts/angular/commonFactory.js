app.factory('CommonsFactory', function ProjectsFactory ($http) {

    var getUserByAuthOId = function (auth0Id, successFunction, errorFunction) {
        $http({method: 'GET', url: '/users/auth0/'+ auth0Id}).then(successFunction, errorFunction)
    };

    return {
        getUserByAuthOId: getUserByAuthOId,
    }
});