app.controller('vendorManageController', function(VendorContactsFactory) {

    var vendorManageController = this;
    vendorManageController.vendors = [];

    vendorManageController.addVendorToManage = function (businessId) {
        console.log("Inside add vendor to manage");
        getVendorContacts(businessId)
    }

    vendorManageController.vendorManagers = [{name: "Test Vendor", category: "DJ", phone_number: 4158121879}];

    vendorManageController.projectVendorCategories = [{ name: 'Photographer'}, {name : 'Wedding Venue'} ,
                                                      { name : 'Music'}, { name : 'Decorator' }, { name : 'Food'} ];

    vendorManageController.init = function (businessId) {
        getVendorContacts(businessId);
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

    $scope.getAddVendorManageTemplateUrl = function () {
        return templates.addVendorManageModal;
    };
}
