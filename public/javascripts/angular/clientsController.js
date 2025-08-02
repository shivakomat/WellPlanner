var Global_Constants = {};
Global_Constants.clientStatuses =  [
    {"type": "New"},
    {"type": "Followed Up"},
    {"type": "Consultation Scheduled"},
    {"type": "Proposal Sent"},
    {"type": "Proposal Accepted"},
    {"type": "Contract Sent"},
    {"type": "Contract Accepted"},
    {"type": "Booked"},
    {"type": "Lost"}
];

app.controller('clientsController', function(ClientsFactory, $rootScope) {
    var clientController = this;
    clientController.clients = [];
    clientController.currentClientId = null;
    clientController.currentClient = null;
    clientController.formData = {};
    clientController.clientStatuses = Global_Constants.clientStatuses;
    clientController.totals = {};

    clientController.showNewItem = false;

    clientController.newItem = function() {
      clientController.formData = {};
      clientController.formData.phoneNumber='';
      clientController.showNewItem = true;
    };

    clientController.cancelItem = function() {
        clientController.showNewItem = false;
    };

    clientController.saveItem = function(businessId) {
        clientController.creatNewClient(businessId)
    };

    clientController.getAllClients = function(businessId) {
        allClients(businessId);
    };

    clientController.creatNewClient = function (businessId) {
        createAClient(businessId)
    };

    clientController.setCurrentClient = function (client) {
        $rootScope.$broadcast('currentClientSet', client);
        clientController.currentClient = client;
        clientController.currentClientId = client.id;
        clientController.currentClientBudget = client.budget;
        var event_date_year = parseInt(client.event_date .toString().substr(0, 4));
        var event_date_month = parseInt(client.event_date .toString().substr(4, 2));
        var event_date_day = parseInt(client.event_date .toString().substr(6, 2));
        client.event_date_moment_js = moment.utc([event_date_year, (event_date_month - 1), event_date_day]);
        clientController.currentClientEventDate = client.event_date_moment_js;
    };

    clientController.removeClient = function (businessId, clientId) {
        deleteAClient(businessId, clientId)
    };

    function allClients(businessId) {
        ClientsFactory.getAllClients(businessId, function mySuccess (response) {
            clientController.clients = response.data.data;
            clientController.totals.totalNew = 0;
            clientController.totals.totalProposalSent = 0;
            clientController.totals.totalLost = 0;
            clientController.totals.totalFollowedUp = 0;
            clientController.totals.totalConsultationsScheduled = 0;
            clientController.totals.totalProposalAccepted = 0;
            clientController.totals.totalContractSent = 0;
            clientController.totals.totalContractAccepted = 0;
            clientController.totals.totalBooked = 0;

            for (var i=0; i < clientController.clients.length; i++) {
                clientController.clients[i][0].event_date_display = moment(clientController.clients[i][0].event_date, "YYYYMMDD").format("MMM-DD-YYYY");

                if(clientController.clients[i][0].status === 'New') {
                    clientController.totals.totalNew++;
                } else if(clientController.clients[i][0].status === 'Lost') {
                    clientController.totals.totalLost++;
                } else if(clientController.clients[i][0].status === 'Proposal Sent') {
                    clientController.totals.totalProposalSent++;
                } else if(clientController.clients[i][0].status === 'Proposal Accepted') {
                    clientController.totals.totalProposalAccepted++;
                } else if(clientController.clients[i][0].status === 'Contract Sent') {
                    clientController.totals.totalContractSent++;
                } else if(clientController.clients[i][0].status === 'Contract Accepted') {
                    clientController.totals.totalContractAccepted++;
                } else if(clientController.clients[i][0].status === 'Consultation Scheduled') {
                    clientController.totals.totalConsultationsScheduled++;
                } else if(clientController.clients[i][0].status === 'Booked') {
                    clientController.totals.totalBooked++;
                } else if(clientController.clients[i][0].status === 'Followed Up') {
                    clientController.totals.totalFollowedUp++;
                }
            }
            console.log(clientController.totalNew);
        }, function myError (response) {
            console.log(response.statusText)
        });
    }

    clientController.updateClient = function editClient(client) {
        var event_date_year = parseInt(client.event_date .toString().substr(0, 4));
        var event_date_month = parseInt(client.event_date .toString().substr(4, 2));
        var event_date_day = parseInt(client.event_date .toString().substr(6, 2));
        client.event_date_moment_js = moment.utc([event_date_year, (event_date_month - 1), event_date_day]);
        clientController.currentClient = client;
    };

    function refresh(businessId) {
        clientController.showNewItem = false;
        allClients(businessId);
    }

    function clearFormData() {
        clientController.formData = {};
    }

    function createAClient(businessId) {
        var newClient = {};
        newClient = clientController.formData;
        newClient.businessId = businessId;
        newClient.notes = '';
        newClient.status = clientController.formData.status.type;
        newClient.eventType = 'WEDDING';
        newClient.eventDate = parseInt(clientController.formData.eventDate.format('YYYYMMDD'));

        ClientsFactory.addClient(newClient, function mySuccess() {
            refresh(businessId);
            clearFormData();
            alerts.autoCloseAlert('success-message', 'New client added!!', 'Good luck!');
        }, function myError() {
            clearFormData();
            alerts.autoCloseAlert('success-message', 'Oops something went wrong', 'Please try again!');
        });
    }

    function deleteAClient(businessId, clientId) {
        ClientsFactory.deleteClientBy(clientId, businessId, function mySuccess() {
            refresh(businessId);
            alerts.autoCloseAlert('success-message', 'Client removed!!', '');
        }, function myError() {
            alerts.autoCloseAlert('title-and-text', 'Oops something went wrong', 'Please try again!');
        })
    }
});

app.directive('phonenumberDirective', ['$filter', function($filter) {
    /*
    Intended use:
        <phonenumber-directive placeholder='prompt' model='someModel.phonenumber'></phonenumber-directive>
    Where:
        someModel.phonenumber: {String} value which to bind only the numeric characters [0-9] entered
            ie, if user enters 617-2223333, value of 6172223333 will be bound to model
        prompt: {String} text to keep in placeholder when no numeric input entered
    */

    function link(scope, element, attributes) {

        // scope.inputValue is the value of input element used in template
        scope.inputValue = scope.phonenumberModel;

        scope.$watch('inputValue', function(value, oldValue) {

            value = String(value);
            var number = value.replace(/[^0-9]+/g, '');
            scope.phonenumberModel = number;
            scope.inputValue = $filter('phonenumber')(number);
        });
    }

    return {
        link: link,
        restrict: 'E',
        scope: {
            phonenumberPlaceholder: '=placeholder',
            phonenumberModel: '=model',
        },
        // templateUrl: '/static/phonenumberModule/template.html',
        template: '<input ng-model="inputValue" class="form-control" style="text-align:center;" type="tel" class="phonenumber" placeholder="{{phonenumberPlaceholder}}" title="Phonenumber (Format: (999) 9999-9999)">',
    };
}]);

app.filter('phonenumber', function() {
    /*
    Format phonenumber as: c (xxx) xxx-xxxx
        or as close as possible if phonenumber length is not 10
        if c is not '1' (country code not USA), does not use country code
    */

    return function (number) {
        /*
        @param {Number | String} number - Number that will be formatted as telephone number
        Returns formatted number: (###) ###-####
            if number.length < 4: ###
            else if number.length < 7: (###) ###
        Does not handle country codes that are not '1' (USA)
        */
        if (!number) { return ''; }

        number = String(number);

        // Will return formattedNumber.
        // If phonenumber isn't longer than an area code, just show number
        var formattedNumber = number;

        // if the first character is '1', strip it out and add it back
        var c = (number[0] == '1') ? '1 ' : '';
        number = number[0] == '1' ? number.slice(1) : number;

        // # (###) ###-#### as c (area) front-end
        var area = number.substring(0,3);
        var front = number.substring(3, 6);
        var end = number.substring(6, 10);

        if (front) {
            formattedNumber = (c + "(" + area + ") " + front);
        }
        if (end) {
            formattedNumber += ("-" + end);
        }
        return formattedNumber;
    };
});

app.directive('newClientModal',  [NewClientModalDirective]);
function NewClientModalDirective() {
    return{
        template: '<ng-include src="getNewClientModalTemplateUrl()"/>',
        scope: false,
        bindToController: {
            businessId: '='
        },
        controller: NewClientModalController,
        controllerAs: 'newClientModalController'
    }
}

app.controller('newClientModalController', [NewClientModalController]);
function NewClientModalController(ClientsFactory, $scope, templates) {
    var newClientModalController = this;

    newClientModalController.eventDate = null;

    newClientModalController.clientStatuses = Global_Constants.clientStatuses;

    $scope.getNewClientModalTemplateUrl = function () {
        return templates.newClientModal;
    };

    function clearFormData() {
        newClientModalController.formData = {};
    }

    newClientModalController.newClient = function () {
       console.log(newClientModalController.formData.eventDate);
       createAClient(newClientModalController.businessId);
    };

    function createAClient(businessId) {
        var newClient = {};
        newClient = newClientModalController.formData;
        newClient.businessId = businessId;
        newClient.notes = '';
        newClient.status = newClientModalController.formData.status.type;
        newClient.eventType = 'WEDDING';
        var reformattedEventDate = newClientModalController.formData.eventDate.format('YYYYMMDD');
        newClient.eventDate = parseInt(reformattedEventDate);

        console.log(newClient);

        ClientsFactory.addClient(newClient, function mySuccess() {
            clearFormData();
            alerts.autoCloseAlert('success-message', 'New client added!!', 'Good luck!');
        }, function myError() {
            clearFormData();
            alerts.autoCloseAlert('success-message', 'Oops something went wrong', 'Please try again!');
        });
    }

}


app.directive('editClientModal',  [EditClientModalDirective]);
function EditClientModalDirective() {
    return{
        template:  '<ng-include src="getEditClientModalTemplateUrl()"/>',
        scope: false,
        bindToController: {
            businessId: '=',
            currentClient: '=',
            clients: '=',
            totals: '='
        },
        controller: EditClientModalController,
        controllerAs: 'editClientModalController'
    }
}

app.controller('editClientModalController', [EditClientModalController]);
function EditClientModalController(ClientsFactory, $scope, templates) {
    var editClientModalController = this;

    editClientModalController.clientStatuses = Global_Constants.clientStatuses;




    $scope.getEditClientModalTemplateUrl = function () {
        return templates.editClientModal;
    };

    editClientModalController.updateClient = function () {
        updateClient(editClientModalController.currentClient, "Client Info updated!", "Always update!");
    };

    function refresh(businessId) {
        allClients(businessId);
    }

    function allClients(businessId) {
        ClientsFactory.getAllClients(businessId, function mySuccess (response) {
            editClientModalController.clients = response.data.data;
            editClientModalController.totals.totalNew = 0;
            editClientModalController.totals.totalProposalSent = 0;
            editClientModalController.totals.totalLost = 0;
            editClientModalController.totals.totalFollowedUp = 0;
            editClientModalController.totals.totalConsultationsScheduled = 0;
            editClientModalController.totals.totalProposalAccepted = 0;
            editClientModalController.totals.totalContractSent = 0;
            editClientModalController.totals.totalContractAccepted = 0;
            editClientModalController.totals.totalBooked = 0;
            for (var i=0; i < editClientModalController.clients.length; i++) {
                editClientModalController.clients[i][0].event_date_display = moment(editClientModalController.clients[i][0].event_date, "YYYYMMDD").format("MMM-DD-YYYY");

                if(editClientModalController.clients[i][0].status === 'New') {
                    editClientModalController.totals.totalNew++;
                } else if(editClientModalController.clients[i][0].status === 'Lost') {
                    editClientModalController.totals.totalLost++;
                } else if(editClientModalController.clients[i][0].status === 'Proposal Sent') {
                    editClientModalController.totals.totalProposalSent++;
                } else if(editClientModalController.clients[i][0].status === 'Proposal Accepted') {
                    editClientModalController.totals.totalProposalAccepted++;
                } else if(editClientModalController.clients[i][0].status === 'Contract Sent') {
                    editClientModalController.totals.totalContractSent++;
                } else if(editClientModalController.clients[i][0].status === 'Contract Accepted') {
                    editClientModalController.totals.totalContractAccepted++;
                } else if(editClientModalController.clients[i][0].status === 'Consultation Scheduled') {
                    editClientModalController.totals.totalConsultationsScheduled++;
                } else if(editClientModalController.clients[i][0].status === 'Booked') {
                    editClientModalController.totals.totalBooked++;
                } else if(editClientModalController.clients[i][0].status === 'Followed Up') {
                    editClientModalController.totals.totalFollowedUp++;
                }
            }
        }, function myError (response) {
            console.log(response.statusText)
        });
    }

    function updateClient(updatedClient, msg, msgDesc) {
        var newClient = {};
        newClient.businessId = updatedClient.business_id;
        newClient.notes = updatedClient.notes;

        if(updatedClient.new_status !== undefined) newClient.status = updatedClient.new_status.type;
        else newClient.status = updatedClient.status;

        newClient.eventType = updatedClient.event_type;
        newClient.budget = updatedClient.budget;
        console.log(newClient.eventDate);
        console.log(editClientModalController.currentClient);
        console.log(updatedClient.eventDate);
        newClient.eventDate = parseInt(updatedClient.event_date_moment_js.format('YYYYMMDD'));
        newClient.emailAddress = updatedClient.email;
        newClient.phoneNumber = updatedClient.phone_number;
        newClient.customerName = updatedClient.name;
        newClient.clientId = updatedClient.id;
        console.log(newClient);
        ClientsFactory.updateClientBy(newClient,
            function mySuccess() {
                refresh(updatedClient.business_id);
                alerts.autoCloseAlert('success-message', msg, msgDesc);
            }, function myError() {
                alerts.autoCloseAlert('success-message', 'Oops something went wrong!', 'Please try again!');
            })
    }

}
