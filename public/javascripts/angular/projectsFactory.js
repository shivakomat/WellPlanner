app.factory('ProjectsFactory', function ProjectsFactory ($http) {
    var getAllProjects = function (businessId, successFunction, errorFunction) {
        $http({method: 'GET', url: '/businesses/'+ businessId + "/projects"}).then(successFunction, errorFunction)
    };

    var addProject = function (project, successFunction, errorFunction) {
        $http({method: 'POST', url: '/businesses/projects', data: project}).then(successFunction, errorFunction);
    };

    var deleteProjectBy = function (projectId, businessId, successFunction, errorFunction) {
        $http({method: 'DELETE', url: '/businesses/' + businessId + '/projects/' + projectId}).then(successFunction, errorFunction);
    };

    var getProject = function (projectId, businessId, successFunction, errorFunction) {
        $http({method: 'GET', url: '/businesses/' + businessId + '/projects/' + projectId + '/info'}).then(successFunction, errorFunction)
    };

    return {
        getAllProjects: getAllProjects,
        addProject: addProject,
        deleteProjectBy: deleteProjectBy,
        getProject: getProject
    }
});
