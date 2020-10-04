app.factory('BusinessFactory', function BusinessFactory ($http) {
    var getBusiness = function (businessId, successFunction, errorFunction) {
        $http({method: 'GET', url: '/businesses/' + businessId}).then(successFunction, errorFunction)
    };

    var updateBusinessInfo = function (updatedBusiness, successFunction, errorFunction) {
        $http({method: 'POST', url: '/businesses/updateInfo', data: updatedBusiness}).then(successFunction, errorFunction);
    };

    var updateTeamMember = function (updatedTeamMember, successFunction, errorFunction) {
        $http({method: 'POST', url: '/businesses/teamMembers', data: updatedTeamMember}).then(successFunction, errorFunction);
    };

    var newTeamMemberToBusiness = function (newTeamMember, successFunction, errorFunction) {
        $http({method: 'POST', url: '/businesses/newTeamMember', data: newTeamMember}).then(successFunction, errorFunction);
    };

    var getBusinessTeamMembers = function (businessId, successFunction, errorFunction) {
        $http({method: 'GET', url: '/businesses/teamMembers/' + businessId}).then(successFunction, errorFunction)
    };


    return {
        getBusiness: getBusiness,
        updateBusinessInfo: updateBusinessInfo,
        newTeamMemberToBusiness: newTeamMemberToBusiness,
        getBusinessTeamMembers: getBusinessTeamMembers,
        updateTeamMember: updateTeamMember
    }
});

