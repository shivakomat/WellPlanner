app.factory('VendorContactsFactory', function VendorContactsFactory ($http) {

    var getAllVendors = function (businessId, successFunction, errorFunction) {
        $http({method: 'GET', url: '/businesses/vendors/' + businessId}).then(successFunction, errorFunction)
    };

    var addVendor = function (newVendor, successFunction, errorFunction) {
        $http({method: 'POST', url: '/businesses/vendors', data: newVendor}).then(successFunction, errorFunction);
    };

    var deleteVendorBy = function (vendorId, businessId, successFunction, errorFunction) {
        $http({method: 'DELETE', url: '/businesses/' + businessId + '/vendors/' + vendorId}).then(successFunction, errorFunction);
    };

    var updateVendorBy = function (updatedVendor, successFunction, errorFunction) {
        $http({method: 'POST', url: '/businesses/vendors/update', data: updatedVendor}).then(successFunction, errorFunction);
    };

    var getAllVendorManages = function (businessId, projectId, successFunction, errorFunction) {
        $http({method: 'GET', url: '/businesses/' + businessId + '/projects/' + projectId + '/vendor-manages'}).then(successFunction, errorFunction)
    };

    var addVendorManage = function (newVendorManage, successFunction, errorFunction) {
        $http({method: 'POST', url: '/businesses/projects/vendor-manages', data: newVendorManage}).then(successFunction, errorFunction);
    };

    return {
        getAllVendors: getAllVendors,
        addVendor: addVendor,
        deleteVendorBy: deleteVendorBy,
        updateVendorBy: updateVendorBy,
        getAllVendorManages : getAllVendorManages,
        addVendorManage: addVendorManage
    }
});
