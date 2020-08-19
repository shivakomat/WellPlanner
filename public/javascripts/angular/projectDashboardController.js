app.controller('projectDashboardController', function(TasksFactory) {

    var projectDashboardController = this;

    projectDashboardController.totalCompletedTasks = 0;
    projectDashboardController.totalUnCompletedTasks = 0;
    // dashboardController.totalVendors = 0;
    // dashboardController.totalClients = 0;
    // dashboardController.businessInfo = {};

    projectDashboardController.init = function (businessId, projectId) {
        setTotalTasks(businessId, projectId);
        // setTotalVendors(businessId);
        // setTotalClients(businessId);
        // setBusinessInfo(businessId)
    };

    function setTotalTasks(businessId, projectId) {
        TasksFactory.allTasks(businessId, projectId,
            function mySuccess (response) {
                var tasks = response.data.data;
                tasks.forEach(myFunction);
                function myFunction(task, index) {
                    if(task.is_completed === true) {
                        projectDashboardController.totalCompletedTasks ++;
                    } else {
                        projectDashboardController.totalUnCompletedTasks ++;
                    }
                }
            }, function myError (response) {
                console.log(response.statusText);
                projectDashboardController.totalCompletedTasks = 0;
                projectDashboardController.totalUnCompletedTasks = 0;
            });
    }

    // function setTotalVendors(businessId) {
    //     VendorContactsFactory.getAllVendors(businessId, function mySuccess (response) {
    //         dashboardController.totalVendors = response.data.data.length;
    //     }, function myError (response) {
    //         console.log(response.statusText);
    //         dashboardController.totalVendors = 0;
    //     });
    // }
    //
    // function setTotalClients(businessId) {
    //     ClientsFactory.getAllClients(businessId, function mySuccess (response) {
    //         dashboardController.totalClients = response.data.data.length;
    //     }, function myError (response) {
    //         console.log(response.statusText);
    //         dashboardController.totalClients = 0;
    //     });
    // }
    //
    // function setBusinessInfo(businessId) {
    //     BusinessFactory.getBusiness(businessId, function mySuccess (response) {
    //         dashboardController.businessInfo = response.data.data;
    //     }, function myError (response) {
    //         console.log(response.statusText);
    //         dashboardController.businessInfo = {};
    //     });
    // }
});