app.controller('registerBusinessController', function($http, $window, CommonsFactory) {

    var pageController = this;

    pageController.businessName = "";
    pageController.phoneNumber = "";
    pageController.socialMediaUrl = "";

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
        console.log("Inside Complete Registration Page - Using Secure Authentication");

        var userData = {
            username: pageController.businessName.toLowerCase().replace(/\s+/g, ''), // Convert business name to username
            password: pageController.password,
            email: pageController.email,
            business_id: 1, // Default business ID
            is_admin: true, // Business owner is admin
            is_customer: false,
            is_an_employee: true
        };

        console.log("Registering user with secure authentication...");

        // Step 1: Register user with our secure authentication system
        $http({
            method: 'POST',
            url: '/api/auth/register',
            headers: {
                'Content-Type': 'application/json'
            },
            data: userData
        }).then(function successCallback(response) {
            console.log("User registration successful:", response.data);
            
            // Step 2: Automatically log in the user after successful registration
            var loginData = {
                username: userData.username,
                password: userData.password
            };
            
            $http({
                method: 'POST',
                url: '/api/auth/login',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: loginData
            }).then(function loginSuccess(loginResponse) {
                console.log("Login successful:", loginResponse.data);
                
                // Store JWT token in localStorage for future requests
                if (loginResponse.data.data && loginResponse.data.data.token) {
                    localStorage.setItem('wellplanner_token', loginResponse.data.data.token);
                    localStorage.setItem('wellplanner_user', JSON.stringify(loginResponse.data.data.user));
                }
                
                // Step 3: Create business record with the new user
                var newBusiness = {
                    email: userData.email,
                    businessName: pageController.businessName,
                    socialMediaUrl: pageController.socialMediaUrl || "",
                    password: userData.password, // backend still expects plain password; consider hashing server-side
                    auth0Id: "na"
                };
                
                $http({
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + loginResponse.data.data.token // Include JWT token
                    },
                    url: '/businesses/signUp',
                    data: newBusiness
                }).then(function businessSuccess(businessResponse) {
                    console.log("Business creation successful:", businessResponse.data);
                    
                    // Step 4: Redirect to dashboard
                    var businessId = businessResponse.data.business_id || userData.business_id;
                    $window.location.href = "/pages/dashboard/" + businessId;
                    
                }, function businessError(error) {
                    console.error("Business creation error:", error);
                    alert("Business registration failed. Please try again.");
                });
                
            }, function loginError(error) {
                console.error("Auto-login error:", error);
                alert("Registration successful but login failed. Please try logging in manually.");
                $window.location.href = "/pages/login";
            });
            
        }, function errorCallback(error) {
            console.error("User registration error:", error);
            
            // Handle specific error cases
            if (error.status === 409) {
                alert("Username or email already exists. Please choose different credentials.");
            } else if (error.status === 400) {
                alert("Invalid registration data. Please check your inputs and try again.");
            } else {
                alert("Registration failed. Please try again.");
            }
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
