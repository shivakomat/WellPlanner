app.controller('settingsController', function(BusinessFactory, ProjectsFactory) {
    var settingsController = this;
    settingsController.formData = {};

    settingsController.init = function (businessId) {
        setBusinessInfo(businessId);
        getAllTeamMembers(businessId);
        allProjects(businessId);
    };

    settingsController.editMember = function (teamMember) {
        settingsController.currentTeamMember = teamMember;
        console.log(settingsController.currentTeamMember);
    };

    function setBusinessInfo(businessId) {
        BusinessFactory.getBusiness(businessId, function mySuccess (response) {
            settingsController.businessInfo  =  response.data.data;
        }, function myError (response) {
            console.log(response.statusText);
            settingsController.businessInfo  =  {};
        });
    }

    settingsController.safeDeleteProject = function(businessId) {
        console.log(settingsController.formData.selectedProjectToDelete);
        ProjectsFactory.deleteProjectBy(settingsController.formData.selectedProjectToDelete.id, businessId,
           function mySuccess (response) {
            allProjects(businessId);
            alerts.autoCloseAlert('success-message', "successfully deleted", "always safely delete!");
        }, function myError (response) {
            alerts.autoCloseAlert('success-message', 'Error deleting project', 'Please try again!');
        });
    };

    settingsController.updateInfo = function (businessId) {
        settingsController.businessInfo.business_id = businessId;
        BusinessFactory.updateBusinessInfo(settingsController.businessInfo, function mySuccess (response) {
            alerts.autoCloseAlert('success-message', "successfully updated", "always update!");
        }, function myError (response) {
            alerts.autoCloseAlert('success-message', 'Error updating task', 'Please try again!');
        });
    };

    function getAllTeamMembers(businessId) {
        BusinessFactory.getBusinessTeamMembers(businessId, function mySuccess(response) {
            settingsController.teamMembers = response.data.data;
        }, function myError(response) {
            console.log(response.statusText);
            settingsController.teamMembers = {};
        });
    }

    function allProjects(businessId) {
        ProjectsFactory.getAllProjects(businessId,
            function mySuccess (response) {
                settingsController.projects = response.data.data;
            }, function myError (response) {
                console.log(response.statusText)
            });
    }

});

app.directive('editTeamMember',  [EditTeamMemberDirective]);
function EditTeamMemberDirective() {
    return{
        template:  '<ng-include src="getEditTeamMemberTemplateUrl()"/>',
        scope: false,
        bindToController: {
            businessId: '=',
            teamMembers: '=',
            currentTeamMember: '='
        },
        controller: EditTeamMemberController,
        controllerAs: 'editTeamMemberController'
    }
}

app.controller('editTeamMemberController', [EditTeamMemberController]);
function EditTeamMemberController(BusinessFactory, $scope, templates) {
    var editTeamMemberController = this;

    $scope.getEditTeamMemberTemplateUrl = function () {
        return templates.editTeamMemberModal;
    };

    editTeamMemberController.updateMember = function () {
        editTeamMemberController.currentTeamMember.business_id = editTeamMemberController.businessId;
        var memberName = editTeamMemberController.currentTeamMember.member_name;
        BusinessFactory.updateTeamMember(editTeamMemberController.currentTeamMember, function mySuccess (response) {
            refresh(editTeamMemberController.currentTeamMember.business_id);
            alerts.autoCloseAlert('success-message', "successfully updated member " + memberName, "Keep members upto date!!");
        }, function myError (response) {
            alerts.autoCloseAlert('success-message', 'Error creating the team member in the system', 'Please try again!');
        });
    };

    function refresh(businessId) {
        allMembers(businessId);
        editTeamMemberController.formData = {};
    }

    function allMembers(businessId) {
        BusinessFactory.getBusinessTeamMembers(businessId, function mySuccess (response) {
            editTeamMemberController.teamMembers  =  response.data.data;
        }, function myError (response) {
            console.log(response.statusText);
            editTeamMemberController.teamMembers  =  {};
        });
    }
}

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