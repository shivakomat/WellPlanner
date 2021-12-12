app.controller('clientLoginController', function($http, $window, ClientAccessFactory) {
    var clientLoginController = this;
    clientLoginController.loginFormData = {};

    clientLoginController.login = function () {
        var loginInfo = clientLoginController.loginFormData;
        ClientAccessFactory.loginClient(loginInfo, function mySuccess(response) {
            clientLoginController.loginFormData = {};
            console.log(response.data.data);
            var target_url =  "https://" + $window.location.host + "/pages/" + response.data.data.business_id +  "/projects/" + response.data.data.project_id + "/projectSettings";
            console.log(target_url);
            $window.location.href = target_url;
        }, function myError(errMsg) {
            clientLoginController.loginFormData = {};
            console.log(errMsg);
            alerts("Login Failed!!!");
        });
    };

});