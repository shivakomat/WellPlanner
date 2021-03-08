app.directive('paymentsModal',  [PaymentsModalDirective]);
function PaymentsModalDirective() {
    return{
        template:  '<ng-include src="getTemplateUrl()"/>',
        scope: false,
        bindToController: {
            businessId: '=',
            projectId: '=',
            payments: '='
        },
        controller: PaymentsModalController,
        controllerAs: 'paymentsController'
    }
}

app.controller('paymentsController', [PaymentsModalController]);
function PaymentsModalController(BudgetFactory, $scope, templates) {
    var paymentsController = this;

    paymentsController.formData = {};

    paymentsController.showNewPayment = false;

    paymentsController.formData.payment_date = new Date();

    paymentsController.options = '{format:"DD.MM.YYYY HH:mm"}';

    paymentsController.cancelItem = function() {
        paymentsController.formData = {};
        paymentsController.showNewPayment = false;
    };

    paymentsController.reset = function() {
      paymentsController.cancelItem();
    };

    paymentsController.addPayment = function() {
        var paymentDate = paymentsController.formData.payment_date.format('YYYYMMDD');
        var newPayment = paymentsController.formData;
        newPayment.payment_date = parseInt(paymentDate);
        console.log(newPayment.payment_date);
        console.log(newPayment);
        console.log("Inside this function");
        console.log(newPayment);
        BudgetFactory.addPayment(newPayment, function mySuccess() {
            alerts.autoCloseAlert('success-message', 'New Budget Payment has been created', 'Awesome!');
            paymentsController.showNewPayment = false;
        }, function myError() {
            alerts.autoCloseAlert('success-message', 'Error Creating payment', 'Please try again!');
        });
    };

    $scope.getTemplateUrl = function () {
        return templates.newPaymentModal;
    };
}




app.directive('newPaymentModal',  [NewPaymentModalDirective]);
function NewPaymentModalDirective() {
    return{
        template:  '<ng-include src="getTemplateUrl()"/>',
        scope: false,
        bindToController: {
            businessId: '=',
            projectId: '=',
        },
        controller: NewPaymentController,
        controllerAs: 'newPaymentController'

    }
}

app.controller('newPaymentController', [NewPaymentController]);
function NewPaymentController(BudgetFactory, $scope, templates) {
    var newPaymentModalController = this;

    newPaymentModalController.formData = {};

    newPaymentModalController.formData.payment_date = new Date();

    newPaymentModalController.options = '{format:"DD.MM.YYYY HH:mm"}';

    newPaymentModalController.addPayment = function() {
        var payment = newPaymentModalController.formData;
        console.log("Inside this function");
        console.log(payment);
        BudgetFactory.addPayment(payment, function mySuccess() {
            alerts.autoCloseAlert('success-message', 'New Budget Payment has been created', 'Awesome!');
        }, function myError() {
            alerts.autoCloseAlert('success-message', 'Error Creating payment', 'Please try again!');
        });
    };

    $scope.getTemplateUrl = function () {
        return templates.newPaymentModal;
    };
}