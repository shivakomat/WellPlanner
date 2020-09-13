app.controller('settingsController', function(BusinessFactory) {
    var settingsController = this;

    settingsController.init = function (businessId) {
        setBusinessInfo(businessId);
    };


    function setBusinessInfo(businessId) {
        BusinessFactory.getBusiness(businessId, function mySuccess (response) {
            settingsController.businessInfo  =  response.data.data;
        }, function myError (response) {
            console.log(response.statusText);
            settingsController.businessInfo  =  {};
        });
    }

    settingsController.updateInfo = function (businessId) {
        settingsController.businessInfo.business_id = businessId;
        BusinessFactory.updateBusinessInfo(settingsController.businessInfo, function mySuccess (response) {
            alerts.autoCloseAlert('success-message', "successfully updated", "always update!");
        }, function myError (response) {
            alerts.autoCloseAlert('success-message', 'Error updating task', 'Please try again!');
        });
    }

});