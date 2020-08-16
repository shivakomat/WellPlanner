app.controller('vendorContactsController', function(VendorContactsFactory, $http, $window) {

    var vendorContactsController = this;
    vendorContactsController.vendors = [];
    vendorContactsController.formData = {};

    vendorContactsController.showNewItem = false;

    vendorContactsController.newItem = function() {
        vendorContactsController.formData = {};
        vendorContactsController.formData.phone_number='';
        vendorContactsController.showNewItem = true;
    };

    vendorContactsController.cancelItem = function() {
        vendorContactsController.showNewItem = false;
    };

    vendorContactsController.saveItem = function(businessId) {
        vendorContactsController.creatNewVendor(businessId)
    };

    vendorContactsController.getAllVendors = function(businessId) {
        allVendors(businessId);
    };

    vendorContactsController.creatNewVendor = function (businessId) {
        createAVendor(businessId)
    };

    vendorContactsController.removeVendor = function (businessId, clientId) {
        deleteAVendor(businessId, clientId)
    };

    function allVendors(businessId) {
        VendorContactsFactory.getAllVendors(businessId, function mySuccess (response) {
            vendorContactsController.vendors = response.data.data;
        }, function myError (response) {
            console.log(response.statusText)
        });
    }

    function refresh(businessId) {
        vendorContactsController.showNewItem = false;
        allVendors(businessId);
    }

    function createAVendor(businessId) {
        var newVendor = {};
        newVendor = vendorContactsController.formData;
        newVendor.business_id = businessId;
        newVendor.notes = '';
        newVendor.vendor_type="local";
        newVendor.estimated_costs=0.0;

        VendorContactsFactory.addVendor(newVendor, function mySuccess() {
            refresh(businessId);
            alerts.autoCloseAlert('success-message', 'New Vendor Contact Created', 'Awesome!');
        }, function myError() {
            alerts.autoCloseAlert('success-message', 'Error Creating Vendor Contact', 'Please try again!');
        });
    }

    function deleteAVendor(businessId, vendorId) {
        VendorContactsFactory.deleteVendorBy(vendorId, businessId, function mySuccess() {
            refresh(businessId);
            alerts.autoCloseAlert('success-message', 'Vendor removed!!', '');
        }, function myError() {
            alerts.autoCloseAlert('title-and-text', 'Error deleting a Vendor', 'Please try again!');
        });
    }
});