app.controller('registerBusinessController', function($http, $window, UserFactory) {

    console.log("Attached JS: registerBusinessController");

    var pageCtrl = this;
    pageCtrl.businessName = undefined;
    pageCtrl.phoneNumber = undefined;
    pageCtrl.websiteLink = undefined;

    pageCtrl.username = undefined;
    pageCtrl.password = undefined;
    pageCtrl.confirmPassword = undefined;
    pageCtrl.email = undefined;

    pageCtrl.city = undefined;
    pageCtrl.country = undefined;
    pageCtrl.zip5 = undefined;
    pageCtrl.state = undefined;

    pageCtrl.nextButtonEnabled = false;
    pageCtrl.validateButtonEnabled = true;

    pageCtrl.businessNameExists = true;
    pageCtrl.isMatch = false;
    pageCtrl.usernameAndEmailValidated = true;
    pageCtrl.userNameExists = true;
    pageCtrl.emailExists = true;

    pageCtrl.errorMsg = undefined;
    pageCtrl.errorPhonenumber = undefined;
    pageCtrl.errorMsgUserName = "";
    pageCtrl.errorMsgEmail = "";
    pageCtrl.errorPassword = undefined;
    pageCtrl.step = 1;

    pageCtrl.phoneNumberValidated = false;
    pageCtrl.businessNameValidated = false;

    pageCtrl.userLogin = function () {
        var user_login_data = {};
        console.log("Hello world")
        user_login_data.user_email = pageCtrl.userEmailAddress;
        user_login_data.user_password = pageCtrl.userPassword;
        UserFactory.loginUser(user_login_data, function mySuccess (response) {
            console.log("successfully logged in user: " + response.data.data.email);
            $window.location.href = "https://" + $window.location.host + "/pages/dashboard/:businessId/" + response.data.data.business_id ;
        }, function myError (response) {
            alerts.autoCloseAlert('success-message', 'Unable to find user', 'Please try again!');
        });
    }

    pageCtrl.isBusinessNameValidated = function () {
        var isValidAlphaNumeric = pageCtrl.isValidInput(pageCtrl.businessName);
        console.log("valid -> " + isValidAlphaNumeric);

        var businessInputGroup = angular.element( document.querySelector( '#businessNameInputGroup' ) );


        if(isValidAlphaNumeric && pageCtrl.businessName !== undefined) {
            var isDigitsOnly = pageCtrl.digitsOnly(pageCtrl.businessName);
            if(!isDigitsOnly) {
                pageCtrl.errorMsg = undefined;
                pageCtrl.businessNameValidated = true;
                if(pageCtrl.phoneNumberValidated) pageCtrl.nextButtonEnabled = true;
                return  true;
            } else {
                pageCtrl.nextButtonEnabled = false;
                pageCtrl.businessNameValidated = false;
                businessInputGroup.removeClass('has-success').addClass('has-danger');
                console.log("next button state: -> " + pageCtrl.nextButtonEnabled);
                pageCtrl.errorMsg = "*Invalid business name. Found digits only. It must be alphanumeric !";
                return false;
            }

        } else {
            if(pageCtrl.businessName === undefined) pageCtrl.errorMsg = "*Required Field";
            else pageCtrl.errorMsg = "*Invalid business name. Cannot use special characters. It must be alphanumeric !";
            businessInputGroup.removeClass('has-success').addClass('has-danger');
            pageCtrl.nextButtonEnabled = false;
            pageCtrl.businessNameValidated = false;
            return false;
        }
    };

    pageCtrl.isPhoneNumberValid = function () {
        var isValid = /^\d{10}$/.test(pageCtrl.phoneNumber);
        if(isValid) {
            pageCtrl.errorPhonenumber = undefined;
            pageCtrl.phoneNumberValidated = true;
            console.log("next button state isPhone 1: -> " + pageCtrl.nextButtonEnabled);
            console.log("business validator -> " + pageCtrl.isBusinessNameValidated);
            if(pageCtrl.businessNameValidated) pageCtrl.nextButtonEnabled = true;
            console.log("next button state isPhone 2: -> " + pageCtrl.nextButtonEnabled);
            return true
        } else {
            pageCtrl.nextButtonEnabled = false;
            pageCtrl.phoneNumberValidated = false;
            pageCtrl.errorPhonenumber = "*Invalid phone number. It must be 10 digits";
            return false
        }
    };

    pageCtrl.setStep = function(step){
        pageCtrl.step = step;
    };

    pageCtrl.nextSignUpSection = function () {
        if(pageCtrl.step === 1 && pageCtrl.businessName !== undefined && pageCtrl.phoneNumber !== undefined) {
            pageCtrl.resetValidateButton();
            pageCtrl.step = pageCtrl.step + 1;
        } else if(pageCtrl.step === 2 && pageCtrl.username !== undefined && pageCtrl.password !== undefined && pageCtrl.email !== undefined && pageCtrl.confirmPassword !== undefined) {
            pageCtrl.resetValidateButton();
            pageCtrl.step = pageCtrl.step + 1;
            pageCtrl.validateButtonEnabled = false;
        } else if(pageCtrl.step === 3 && pageCtrl.city !== undefined && pageCtrl.state !== undefined && pageCtrl.zipCode !== undefined && pageCtrl.country !== undefined) {
            // do nothing yet
        }
    };

    pageCtrl.previousSection = function () {
        pageCtrl.resetValidateButton();
        pageCtrl.step = pageCtrl.step - 1;
    };

    pageCtrl.registerBusinessWithAdminUser = function () {
            var data = {};
            data.business = {};
            data.business.name = pageCtrl.businessName;
            data.business.city = pageCtrl.city;
            data.business.state = pageCtrl.state;
            data.business.country = pageCtrl.country;
            data.user = {};
            data.user.username = pageCtrl.username;
            data.user.password = pageCtrl.confirmPassword;
            data.user.email = pageCtrl.email;
            data.user.isAdmin = true;

            console.log(JSON.stringify(data));

            $http({
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                url: '/businesses/signUp',
                data: JSON.stringify(data),
            }).then(function mySuccess() {
                console.log("successfully created");
            }, function myError() {
                console.log("ERROR creating a trip");
            })
    };

    pageCtrl.passwordMatch = function () {
        pageCtrl.isMatch = angular.equals(pageCtrl.password, pageCtrl.confirmPassword);
    };

    pageCtrl.resetValidateButton = function () {
        pageCtrl.validateButtonEnabled = true;
        pageCtrl.nextButtonEnabled = false;
    };

    pageCtrl.setStepIfTabMenuClicked = function (tabName) {
        if(tabName === 'About') {
            pageCtrl.step = 1;
        } else if(tabName === 'Account') {
            pageCtrl.step = 2;
        } else if (tabName === 'Location') {
            pageCtrl.step = 3;
        }
    };

    pageCtrl.businessInfoSection = 1;
    pageCtrl.accountInfoSecion = 2;
    pageCtrl.locationInfoSection = 3;

    pageCtrl.validateForm = function () {
        console.log("validate button pressed");

        if(pageCtrl.step === pageCtrl.businessInfoSection) {
            console.log("validating business section");

            if(pageCtrl.businessName === undefined) {
                pageCtrl.errorMsg = "*required field for validation"
            } else {
                if(pageCtrl.isValidInput(pageCtrl.businessName)) {
                    if(pageCtrl.digitsOnly(pageCtrl.businessName)) {
                        pageCtrl.businessNameExists = true;
                        pageCtrl.errorMsg = "*Invalid business name. Found digits only. It must be alphanumeric !"
                    } else {
                        console.log("validating business name");
                        pageCtrl.validateBusinessName();
                    }
                } else {
                    pageCtrl.businessNameExists = true;
                    pageCtrl.errorMsg = "*Invalid business name. It must be alphanumeric !"
                }
            }

        } else if (pageCtrl.step === pageCtrl.accountInfoSecion) {

            console.log("step 2");
            console.log(pageCtrl.username);
            console.log(pageCtrl.email);

            if(pageCtrl.username === undefined) pageCtrl.errorMsgUserName = "*required field for validation";
            else pageCtrl.errorMsgUserName = "";

            if(pageCtrl.email === undefined) pageCtrl.errorMsgEmail = "*required field for validation";
            else pageCtrl.errorMsgEmail = "";

            if(pageCtrl.username !== undefined && pageCtrl.email !== undefined) {
                if(pageCtrl.isValidUsername(pageCtrl.username)) {
                    if(pageCtrl.digitsOnly(pageCtrl.username)) {
                        pageCtrl.userNameExists = true;
                        pageCtrl.errorMsgUserName = "*Invalid username. Found digits only. It must be alphanumeric !"
                    } else {
                        if(pageCtrl.isValidPassword(pageCtrl.password)) {
                            pageCtrl.errorPassword = undefined;
                            var emailFormatGood = pageCtrl.validateEmailSyntax(pageCtrl.email);
                            if (emailFormatGood) pageCtrl.validationsForUsernameEmailAndPassword();
                            else pageCtrl.errorMsgEmail = "Email format is invalid!";
                        } else {
                            pageCtrl.errorPassword = "*Invalid password. At least 1 upper, 1 lower, 1 digit, 1 special char, and minimum 8 characters "
                        }
                    }
                } else {
                    pageCtrl.userNameExists = true;
                    pageCtrl.errorMsgUserName = "*Invalid username. It must be alphanumeric and no spaces!"
                }
            }
        } else if (pageCtrl.step === pageCtrl.locationInfoSection) {
            if(!pageCtrl.isValidAlphabetsOnlyData(pageCtrl.city)) {
                pageCtrl.errorCityMsg = "*Invalid City. Alphabets only!!"
            }

            if(!pageCtrl.isValidAlphabetsOnlyData(pageCtrl.state)) {
                pageCtrl.errorStateMessage = "*Invalid State. Alphabets only!!"
            }

        }
    };

    pageCtrl.validateBusinessName = function () {
        $http({
            method: 'GET',
            url: '/businesses/exists/businessName=' + pageCtrl.businessName
        }).then(function successCallback(response) {
            if(response.status === 200) {
                pageCtrl.businessNameExists = response.data.data;
                console.log("business name exist " + pageCtrl.businessNameExists);

                if(pageCtrl.businessNameExists) {
                    pageCtrl.errorMsg = "Business Name is used!";
                    pageCtrl.validateButtonEnabled = true;
                    pageCtrl.nextButtonEnabled = false;
                } else {
                    pageCtrl.validateButtonEnabled = false;
                    pageCtrl.nextButtonEnabled = true;
                    pageCtrl.errorMsg = "";
                }
                return response.data.data;
            }
        }, function errorCallback(response) {
            console.log("Request failed!!")
        });
    };

    pageCtrl.validationsForUsernameEmailAndPassword = function () {
        $http({
            method: 'GET',
            url: '/users/username='+ pageCtrl.username
        }).then(function successCallback(response) {
            if(response.status === 200) {
                pageCtrl.userNameExists = response.data.data;
                console.log("username exists " + pageCtrl.userNameExists);

                if(pageCtrl.userNameExists) {
                    pageCtrl.validateButtonEnabled = true;
                    pageCtrl.nextButtonEnabled = false;
                    pageCtrl.errorMsgUserName = "*username has been used!"
                } else {
                    pageCtrl.validateEmail();
                }
            }
        }, function errorCallback(response) {
                console.log("Request failed!!")
        });
    };


    pageCtrl.validateEmail = function () {
        $http({
            method: 'GET',
            url: '/users/email='+ pageCtrl.email
        }).then(function successCallback(response) {
            if(response.status === 200) {
                pageCtrl.emailExists = response.data.data;
                console.log("email  exist " + pageCtrl.userNameExists);

                if(pageCtrl.emailExists) {
                    pageCtrl.validateButtonEnabled = true;
                    pageCtrl.nextButtonEnabled = false;
                    pageCtrl.errorMsgEmail = "*email is being used already!"
                } else if(!pageCtrl.userNameExists && !pageCtrl.emailExists) {
                    pageCtrl.validateButtonEnabled = false;
                    pageCtrl.nextButtonEnabled = true;
                    pageCtrl.errorMsgEmail = "";
                }

            }
        }, function errorCallback(response) {
            console.log("Request failed!!")
        });
    };

    // not being used at the moment
    pageCtrl.validateUsernameAndEmail = function () {
        $http({
            method: 'GET',
            url: '/businesses/users/username='+ pageCtrl.username + '/email=' + pageCtrl.email
        }).then(function successCallback(response) {
            if(response.status === 200) {
                pageCtrl.userNameExists = response.data.data.usernameExists;
                pageCtrl.emailExists = response.data.data.emailExists;

                if(!pageCtrl.userNameExists && !pageCtrl.emailExists) {
                    pageCtrl.validateButtonEnabled = false;
                    pageCtrl.nextButtonEnabled = true;
                    pageCtrl.errorMsgUserName = "";
                    pageCtrl.errorMsgEmail = "";
                }

                if(pageCtrl.userNameExists) {
                    pageCtrl.validateButtonEnabled = true;
                    pageCtrl.nextButtonEnabled = false;
                    pageCtrl.errorMsgUserName = "username is used!"
                }

                if(pageCtrl.emailExists) {
                    pageCtrl.validateButtonEnabled = true;
                    pageCtrl.nextButtonEnabled = false;
                    pageCtrl.errorMsgEmail = "email is used!"
                }

                return response.data.data;
            }
        }, function errorCallback(response) {
            console.log("Request failed!!")
        });
    };


    pageCtrl.digitsOnly = function (data) {
        return /^\d+$/.test(data);
    };

    pageCtrl.isValidInput = function (data) {
        var regex = /^[A-Za-z0-9 ]+$/;
        return regex.test(data);
    };

    pageCtrl.isValidUsername = function (username) {
        return /^[a-zA-Z0-9\-_]{0,24}$/.test(username)
    };

    pageCtrl.isValidPassword = function (password) {
        //     At least 1 uppercase character.
        //     At least 1 lowercase character.
        //     At least 1 digit.
        //     At least 1 special character.
        //     Minimum 8 characters.
        return !!(password.match(/[a-z]/g) && password.match(/[A-Z]/g) && password.match(/[0-9]/g) && password.match(/[^a-zA-Z\d]/g) && password.length >= 8);
    };

    pageCtrl.validateEmailSyntax = function (mail) {
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) return true;
        alert("You have entered an invalid email address!");
        return false
    };


    pageCtrl.areThereSpecialCharacters = function (formValue) {
        return /[^a-zA-Z0-9\-\/]/.test( formValue );
    };

    pageCtrl.isValidAlphabetsOnlyData = function (formValue) {
        return /[^a-zA-Z\-\/]/.test(formValue);
    }

});