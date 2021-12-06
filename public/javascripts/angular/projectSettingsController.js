app.controller('projectSettingsController', function(ClientAccessFactory) {
    var projectSettingsController = this;

    projectSettingsController.clientAccessSettings = null;
    projectSettingsController.clientAccessSettingsFormData = {};


    function clearFormData() {
        projectSettingsController.clientAccessSettings = {};
    }

    projectSettingsController.init = function(projectId, businessId) {
        ClientAccessFactory.getAccess(businessId, projectId, function mySuccess(response) {
            projectSettingsController.clientAccessSettings = response.data.data;
            projectSettingsController.clientAccessSettingsFormData = response.data.data;
        }, function myError(response) {
            console.log(response.statusText)
        });
    };

    projectSettingsController.updateAccessSettings = function(businessId, projectId) {
        console.log("updating access settings");
        var newAccess = {};
        newAccess = projectSettingsController.clientAccessSettingsFormData;
        newAccess.business_id = businessId;
        newAccess.project_id = projectId;
        newAccess.logged_in = false;
        console.log(newAccess);

        ClientAccessFactory.updateClientAccess(newAccess, function mySuccess() {
            clearFormData();
            alerts.autoCloseAlert('success-message', 'Client access updated!!', 'Good luck!');
        }, function myError() {
            clearFormData();
            alerts.autoCloseAlert('success-message', 'Oops something went wrong', 'Please try again!');
        });
    };

    projectSettingsController.createAClientAccess = function(businessId, projectId) {
        var newAccess = {};
        newAccess = projectSettingsController.clientAccessSettingsFormData;
        newAccess.business_id = businessId;
        newAccess.project_id = projectId;
        newAccess.logged_in = false;
        console.log(newAccess);

        ClientAccessFactory.addClientAccess(newAccess, function mySuccess() {
            clearFormData();
            alerts.autoCloseAlert('success-message', 'Client access added!!', 'Good luck!');
        }, function myError() {
            clearFormData();
            alerts.autoCloseAlert('success-message', 'Oops something went wrong', 'Please try again!');
        });
    };




});