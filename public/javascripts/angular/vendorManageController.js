app.controller('vendorManageController', function(VendorContactsFactory) {

    var vendorManageController = this;
    vendorManageController.vendors = [];
    vendorManageController.vendorManages = [];


    vendorManageController.addVendorToManage = function (businessId) {
        console.log("Inside add vendor to manage");
        getVendorContacts(businessId)
    }

    vendorManageController.projectVendorCategories = [{ name: 'Photographer'}, {name : 'Wedding Venue'} ,
                                                      { name : 'Music'}, { name : 'Decorator' }, { name : 'Food'} ];

    vendorManageController.init = function (businessId, projectId) {
        getVendorContacts(businessId);
        getVendorManages(businessId, projectId)
    }

    function getVendorManages(businessId, projectId) {
        VendorContactsFactory.getAllVendorManages(businessId, projectId, function mySuccess (response) {
            vendorManageController.vendorManages = response.data.data;
            console.log(vendorManageController.vendorManages);
        }, function myError (response) {
            console.log(response.statusText);
        })
    }

    function getVendorContacts(businessId) {
        VendorContactsFactory.getAllVendors(businessId, function mySuccess (response) {
            vendorManageController.vendors = response.data.data;
            console.log(vendorManageController.vendors);
        }, function myError (response) {
            console.log(response.statusText)
        });
    }
});

app.directive('addVendorToManage',  [AddVendorManageModalDirective]);
function AddVendorManageModalDirective() {
    return{
        template:  '<ng-include src="getAddVendorManageTemplateUrl()"/>',
        scope: false,
        bindToController: {
            businessId: '=',
            projectId: '=',
            projectVendorCategories: '=',
            vendors: '='
        },
        controller: AddVendorManageModalController,
        controllerAs: 'addVendorManageModalController'
    }
}

app.controller('addVendorManageModalController', [AddVendorManageModalController]);
function AddVendorManageModalController(VendorContactsFactory, $scope, templates) {
    var addVendorManageModalController = this;

    addVendorManageModalController.formData = {};

    $scope.getAddVendorManageTemplateUrl = function () {
        return templates.addVendorManageModal;
    };

    addVendorManageModalController.addNewVendorToManage = function () {
        newVendorManage();
    };

    function newVendorManage() {
        var vendorManage = {};
        vendorManage.business_id = addVendorManageModalController.businessId;
        vendorManage.project_id = addVendorManageModalController.projectId;
        vendorManage.vendor_contact_id = addVendorManageModalController.formData.selectedVendor.id
        console.log(vendorManage);
        VendorContactsFactory.addVendorManage(vendorManage, function mySuccess() {
            // refresh(newTaskListModalController.businessId, newTaskListModalController.projectId);
            alerts.autoCloseAlert('success-message', 'New vendor to manage is created!!', 'Nice start!');
        }, function myError() {
            alerts.autoCloseAlert('success-message', 'Sorry, unable to create a new vendor manage', 'Please try again!');
        });
    }
}
