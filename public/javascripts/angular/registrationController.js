app.controller('registerBusinessController', function($http, $window) {

    var pageController = this;

    pageController.businessName = "";
    pageController.phoneNumber = "";

    pageController.password = "";
    pageController.email = "";


    $(document).ready(function() {
        businessRegistrationWizard.initWizard(); // Initialize Business User Registration Wizard
        setTimeout(function() { $('.card.card-wizard').addClass('active'); }, 600);
    });

    pageController.onFinish = function () {
        var $valid = $('.card-wizard form').valid();
        if (!$valid) {
            return false;
        } else {
            pageController.completeRegistration();
        }
    };

    function getUrlVars() {
        var vars = {};
        var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
            vars[key] = value;
        });
        return vars;
    }


    pageController.initializeFormValidators = function () {
        // pageController.businessName = decodeURI(getUrlVars()['businessName']);
        // pageController.email = decodeURI(getUrlVars()['email']);

        $.validator.addMethod("alphanumericWithSpaces", function (value, element) {
            return this.optional(element) || wellPlannerValidators.isValidAlphanumericWithSpaces(value);
        }, "Alphanumeric format with spaces only, other special characters not allowed!");

        $.validator.addMethod("digitsOnly", function (value, element) {
            return this.optional(element) || wellPlannerValidators.isNotDigitsOnly(value);
        }, "Found only digits, we need alphanumeric format please!");

        $.validator.addMethod("ourPasswordValid", function (password, element) {
            return this.optional(element) || wellPlannerValidators.isOurPasswordOnly(password);
        }, "At least 1 upper, 1 lower, 1 digit, 1 special char, and minimum 8 characters");

        $.validator.addMethod("emailAddressAvailable", function (email, element) {
            return this.optional(element) || !pageController.validateEmail(email);
        }, "Email address is taken!!");
    };


    pageController.completeRegistration = function () {
        console.log("Inside Complete Registration Page");

        var data = {};
        data.businessName = pageController.businessName;
        data.password = pageController.password;
        data.email = pageController.email;
        data.phoneNumber = pageController.phoneNumber;

        // console.log("incoming data -> " + JSON.stringify(data));

        $http({
            'crossDomain': true,
            'url': 'https://wellplanner.auth0.com/dbconnections/signup',
            'method': 'POST',
            'headers': {
                'Content-Type': 'application/json'
            },
            'data': {
                'client_id': 'Kp0T1n3QIsJqcvR5dJTDJ0ghbR4idZvr',
                'email': pageController.email,
                'password': pageController.password,
                'connection': 'well-planner-users',
                'name': pageController.businessName,
                'user_metadata': {'color': 'red'}
            }
        }).then(function successCallback(response) {
            var newBusiness =  {};
            newBusiness.email = response.data.email;
            newBusiness.password = data.password;
            newBusiness.businessName = data.businessName;
            newBusiness.phoneNumber = data.phoneNumber.toString();
            newBusiness.auth0Id = response.data._id;

            // console.log(newBusiness);

            $http({
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                url: '/businesses/signUp',
                data: newBusiness,
            }).then(function mySuccess() {
                $window.location.href =
                    "http://" + $window.location.host + "/pages/dashboard"
            }, function myError() {
                alert("Internal Registration Error!!");
            })

        }, function errorCallback(response) {
            alert("Authentication Registration Error!!")
        });
    };


    pageController.validateEmail = function (email) {
        $http({
            method: 'GET',
            url: '/users/email='+ email
        }).then(function successCallback(response) {
            if(response.status === 200) {
                pageController.emailExists = response.data.data;
                console.log("email  exist " + pageController.emailExists);
                return pageController.emailExists;
            }
        }, function errorCallback(response) {
            console.log("Request failed!!");
            return false;
        });
    };

});