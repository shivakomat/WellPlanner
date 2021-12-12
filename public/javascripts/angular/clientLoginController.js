app.controller('clientLoginController', function($http, $window, ClientAccessFactory) {
    var clientLoginController = this;
    clientLoginController.loginFormData = {};

    clientLoginController.login = function () {
        var loginInfo = clientLoginController.loginFormData;
        ClientAccessFactory.loginClient(loginInfo, function mySuccess(response) {
            clientLoginController.loginFormData = {};
            var targetUrl =  "https://" + $window.location.host + "/pages/client-portal/" + response.data.data.businessId +  "/projects/" + response.data.data.projectId;
            $window.location.href = targetUrl;
        }, function myError(errMsg) {
            clientLoginController.loginFormData = {};
            console.log(errMsg);
            alerts("Login Failed!!!");
        });
    };

});