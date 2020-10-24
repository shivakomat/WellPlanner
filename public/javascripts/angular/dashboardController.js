app.controller('dashboardController', function(ProjectsFactory, VendorContactsFactory, ClientsFactory, BusinessFactory, $timeout) {

   var dashboardController = this;

    dashboardController.clock = "loading clock..."; // initialise the time variable
    dashboardController.tickInterval = 1000; //ms
    dashboardController.isLoaded = false;

    var tick = function() {
        dashboardController.clock = Date.now(); // get the current time
        $timeout(tick, dashboardController.tickInterval); // reset the timer
    };

    // Start the timer
    $timeout(tick, dashboardController.tickInterval);

    dashboardController.totalProjects = 0;
    dashboardController.totalVendors = 0;
    dashboardController.totalClients = 0;
    dashboardController.businessInfo = {};

    dashboardController.init = function (businessId) {
        setTotalProjects(businessId);
        setTotalVendors(businessId);
        setTotalClients(businessId);
        setBusinessInfo(businessId);
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

    function setTotalVendors(businessId) {
        VendorContactsFactory.getAllVendors(businessId, function mySuccess (response) {
            dashboardController.totalVendors = response.data.data.length;
        }, function myError (response) {
            console.log(response.statusText);
            dashboardController.totalVendors = 0;
        });
    }

    function setTotalClients(businessId) {
        ClientsFactory.getAllClients(businessId, function mySuccess (response) {
            dashboardController.totalClients = response.data.data.length;
        }, function myError (response) {
            console.log(response.statusText);
            dashboardController.totalClients = 0;
        });
    }

    function setBusinessInfo(businessId) {
        BusinessFactory.getBusiness(businessId, function mySuccess (response) {
            dashboardController.businessInfo = response.data.data;
            setTimeout(() => { dashboardController.isLoaded = true; }, 500);

        }, function myError (response) {
            console.log(response.statusText);
            dashboardController.businessInfo = {};
        });
    }
});