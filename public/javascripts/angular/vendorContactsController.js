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


    vendorContactsController.editVendor = function (vendor) {
        vendorContactsController.currentVendor = vendor;
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


app.directive('editVendorModal',  [EditVendorModalDirective]);
function EditVendorModalDirective() {
    return{
        templateUrl:  "http://localhost:7000/assets/javascripts/angular/editVendorModal.html",
        scope: false,
        bindToController: {
            businessId: '=',
            currentVendor: '=',
            vendors: '='
        },
        controller: EditVendorModalController,
        controllerAs: 'editVendorModalController'
    }
}

app.controller('editVendorModalController', [EditVendorModalController]);
function EditVendorModalController(VendorContactsFactory) {
    var editVendorModalController = this;

    editVendorModalController.updateVendor = function () {
        updateVendor(editVendorModalController.currentVendor, "Vendor Info updated!", "Always update!");
    };

    function refresh(businessId) {
        allVendors(businessId);
    }

    function allVendors(businessId) {
        VendorContactsFactory.getAllVendors(businessId, function mySuccess (response) {
            editVendorModalController.vendors = response.data.data;
        }, function myError (response) {
            console.log(response.statusText)
        });
    }

    function updateVendor(updatedVendor, msg, msgDesc) {
        console.log(updatedVendor);
        VendorContactsFactory.updateVendorBy(updatedVendor,
            function mySuccess() {
                refresh(updatedVendor.business_id);
                alerts.autoCloseAlert('success-message', msg, msgDesc);
            }, function myError() {
                alerts.autoCloseAlert('success-message', 'Oops something went wrong!', 'Please try again!');
            })
    }

}