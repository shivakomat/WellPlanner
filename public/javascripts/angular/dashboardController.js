app.controller('dashboardController', function(ProjectsFactory) {

   var dashboardController = this;

    dashboardController.totalProjects = 0;

    dashboardController.init = function (businessId) {
        setTotalProjects(businessId);
    };

    function setTotalProjects(businessId) {
        ProjectsFactory.getAllProjects(businessId,
            function mySuccess (response) {
                dashboardController.totalProjects = response.data.data.length;
            }, function myError (response) {
                console.log(response.statusText);
                dashboardController.totalProjects = 0;
            });
    }

});