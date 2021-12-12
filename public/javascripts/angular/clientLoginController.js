app.controller('clientLoginController', function($http, $window, ClientAccessFactory) {
    var clientLoginController = this;
    clientLoginController.loginFormData = {};

    clientLoginController.login = function () {
        var loginInfo = clientLoginController.loginFormData;
        ClientAccessFactory.loginClient(loginInfo, function mySuccess(response) {
            clientLoginController.loginFormData = {};
            $window.location.href = "https://" + $window.location.host + "/pages/client-portal/" + response.data.data.business_id + "/projects/" + response.data.data.project_id;
        }, function myError(errMsg) {
            clientLoginController.loginFormData = {};
            console.log(errMsg);
            alerts("Login Failed!!!");
        });
    };

});