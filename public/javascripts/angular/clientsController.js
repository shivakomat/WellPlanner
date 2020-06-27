app.controller('clientsController', function($http, $window) {
    // $window.location.href = "http://" + $window.location.host + "/pages/customers";

    var clientController = this;
    clientController.clients = [];
    clientController.formData = {};
    clientController.clientStatuses = [
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

    clientController.removeClient = function (businessId, clientId) {
        deleteAClient(businessId, clientId)
    };

    function allClients(businessId) {
        $http({
            method: 'GET',
            url: '/businesses/clients/'+ businessId
        }).then(function mySuccess (response) {
            clientController.clients = response.data.data;
        }, function myError (response) {
            console.log(response.statusText)
        });
    }

    function refresh(businessId) {
        clientController.showNewItem = false;
        allClients(businessId);
    }

    function createAClient(businessId) {
        var newClient = {};
        newClient = clientController.formData;
        newClient.businessId = businessId;
        newClient.notes = '';
        newClient.status = clientController.formData.status.type;
        newClient.eventType = 'WEDDING';
        newClient.eventDate = '';

        // alerts.autoCloseAlert('auto-close', 'adding new client', '');

        $http({
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            url: '/businesses/clients',
            data: newClient,
        }).then(function mySuccess() {
            refresh(businessId);
            alerts.autoCloseAlert('success-message', 'New Client Created', 'Awesome!');
        }, function myError() {
            alerts.autoCloseAlert('success-message', 'Error Creating Client', 'Please try again!');
        })
    }

    function deleteAClient(businessId, clientId) {
        $http({
            method: 'DELETE',
            url: '/businesses/' + businessId + '/clients/' + clientId
        }).then(function mySuccess() {
            refresh(businessId);
            alerts.autoCloseAlert('success-message', 'Client removed!!', '');
        }, function myError() {
            alerts.autoCloseAlert('title-and-text', 'Error deleting a client', 'Please try again!');
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
