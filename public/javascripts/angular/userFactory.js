app.factory('UserFactory', function UserFactory ($http) {

    var loginUser = function (userData, successFunction, errorFunction) {
        $http({method: 'POST', url: '/users/login', data: userData}).then(successFunction, errorFunction);
    };

    return {
        addProject: addProject
    }
});
