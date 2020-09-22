app.controller('settingsController', function(BusinessFactory) {
    var settingsController = this;

    settingsController.init = function (businessId) {
        setBusinessInfo(businessId);
        getAllTeamMembers(businessId);
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
    };

    function getAllTeamMembers(businessId) {
        BusinessFactory.getBusinessTeamMembers(businessId, function mySuccess (response) {
            settingsController.teamMembers  =  response.data.data;
        }, function myError (response) {
            console.log(response.statusText);
            settingsController.teamMembers  =  {};
        });
    };

});


app.directive('addNewTeamMember',  [AddNewTeamMemberDirective]);
function AddNewTeamMemberDirective() {
    return{
        template:  '<ng-include src="getNewTeamMemberTemplateUrl()"/>',
        scope: false,
        bindToController: {
            businessId: '=',
            teamMembers: '='
        },
        controller: NewTeamMemberController,
        controllerAs: 'newTeamMemberController'
    }
}


app.controller('newTeamMemberController', [NewTeamMemberController]);
function NewTeamMemberController(BusinessFactory, $scope, templates) {
    var newTeamMemberController = this;

    $scope.getNewTeamMemberTemplateUrl = function () {
        return templates.newTeamMemberModal;
    };

    newTeamMemberController.addMember = function () {
        newTeamMemberController.formData.business_id = newTeamMemberController.businessId;
        var memberName = newTeamMemberController.formData.member_name;
        BusinessFactory.newTeamMemberToBusiness(newTeamMemberController.formData, function mySuccess (response) {
            refresh(newTeamMemberController.formData.business_id);
            alerts.autoCloseAlert('success-message', "successfully added member " + memberName, "Great job on a new member!!");
        }, function myError (response) {
            alerts.autoCloseAlert('success-message', 'Error creating the team member in the system', 'Please try again!');
        });
    };

    function refresh(businessId, projectId) {
        allTasks(businessId, projectId);
        newTeamMemberController.formData = {};
    }

    function allTasks(businessId) {
        BusinessFactory.getBusinessTeamMembers(businessId, function mySuccess (response) {
            newTeamMemberController.teamMembers  =  response.data.data;
        }, function myError (response) {
            console.log(response.statusText);
            newTeamMemberController.teamMembers  =  {};
        });
    }
}