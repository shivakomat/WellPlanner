app.directive('paymentsModal',  [PaymentsModalDirective]);
function PaymentsModalDirective() {
    return{
        template:  '<ng-include src="getTemplateUrl()"/>',
        scope: false,
        bindToController: {
            businessId: '=',
            projectId: '=',
            breakDownListId: '=',
            breakDownItemId: '=',
            payments: '=',
            breakDownsLists: '='
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

    $scope.getTemplateUrl = function () {
        return templates.newPaymentModal;
    };

    paymentsController.cancelItem = function() {
        paymentsController.formData = {};
        paymentsController.showNewPayment = false;
    };

    paymentsController.reset = function() {
      paymentsController.cancelItem();
    };

    paymentsController.deletePayment = function(paymentId) {
        console.log(paymentsController.breakDownItemId);
        BudgetFactory.deletePayment(paymentsController.projectId, paymentsController.businessId, paymentsController.breakDownItemId, paymentId, function mySuccess(){
            refresh(paymentsController.businessId, paymentsController.projectId);
            alerts.autoCloseAlert('success-message', 'Payment removed!!', '');
        }, function myError() {
            alerts.autoCloseAlert('title-and-text', 'Error deleting payment', 'Please refresh your browser and try again!');
        });
    };

    paymentsController.addPayment = function() {
        var paymentDate = paymentsController.formData.payment_date.format('YYYYMMDD');
        var newPayment = {};
        newPayment.payment_amount = paymentsController.formData.payment_amount;
        newPayment.payment_date = parseInt(paymentDate);
        newPayment.business_id = paymentsController.businessId;
        newPayment.project_id = paymentsController.projectId;
        newPayment.budget_id = paymentsController.breakDownItemId;
        console.log(newPayment.payment_date);
        console.log(newPayment);
        console.log("Inside this function");

        BudgetFactory.addPayment(newPayment, function mySuccess() {
            refresh(paymentsController.businessId, paymentsController.projectId);
            alerts.autoCloseAlert('success-message', 'New Budget Payment has been created', 'Awesome!');
        }, function myError() {
            alerts.autoCloseAlert('success-message', 'Error Creating payment', 'Please try again!');
        });

        paymentsController.showNewPayment = false;
    };

    function refresh(businessId, projectId) {
        BudgetFactory.allBreakdowns(businessId, projectId, function (response) {
            paymentsController.breakDownsLists = calcTotalEstimateAndActual(response.data.data);
            paymentsController.payments = getPaymentsFromBreakDownLists(paymentsController.breakDownsLists, paymentsController.breakDownListId, paymentsController.breakDownItemId);
            paymentsController.formData = {};
        }, function (response) { console.log(response.statusText);
        })
    }

    function getPaymentsFromBreakDownLists(breakDownsLists, breakDownListId, breakDownItemId) {
        var p;
        for (p = 0; p < breakDownsLists.length; p++) {
            var x;
            if(breakDownsLists[p].breakDown.id === breakDownListId) {
                for (x = 0; x < breakDownsLists[p].subBreakDowns.length; x++) {
                    if (breakDownsLists[p].subBreakDowns[x].breakdownItem.id === breakDownItemId) {
                        return breakDownsLists[p].subBreakDowns[x].payments;
                    }
                }
            }
        }
    }

    function calcTotalEstimateAndActual(breakdownList) {
        var p;
        var overallEstimate = 0;
        var overallActual = 0;
        var overallAmountPaid = 0;
        for (p = 0; p < breakdownList.length; p++) {
            var x;
            var totalEstimated = 0;
            var totalActual = 0;
            var totalPaid = 0;
            for(x = 0; x < breakdownList[p].subBreakDowns.length; x++) {
                totalEstimated = totalEstimated + breakdownList[p].subBreakDowns[x].breakdownItem.estimate;
                totalActual = totalActual + breakdownList[p].subBreakDowns[x].breakdownItem.actual;
                var totalAmountPaid = 0;
                for(j = 0; j < breakdownList[p].subBreakDowns[x].payments.length; j++) {
                    totalAmountPaid = breakdownList[p].subBreakDowns[x].payments[j].payment_amount + totalAmountPaid;
                    breakdownList[p].subBreakDowns[x].payments[j].payment_date_display = moment(breakdownList[p].subBreakDowns[x].payments[j].payment_date, "YYYYMMDD").format("MMM-DD-YYYY");
                }
                breakdownList[p].subBreakDowns[x].breakdownItem.amountPaid = totalAmountPaid;
                totalPaid = totalAmountPaid + totalPaid;
            }
            breakdownList[p].totalEstimate =  totalEstimated;
            breakdownList[p].totalActual =  totalActual;
            breakdownList[p].totalPaid =  totalPaid;
            breakdownList[p].totalBalance =  totalActual - totalPaid;
            overallEstimate = overallEstimate + totalEstimated;
            overallActual = overallActual + totalActual;
            overallAmountPaid = totalPaid + overallAmountPaid;
        }
        breakdownList.overallEstimate = overallEstimate;
        breakdownList.overallActual = overallActual;
        breakdownList.totalSavings = breakdownList.overallEstimate - breakdownList.overallActual;
        breakdownList.overallAmountPaid = overallAmountPaid;
        breakdownList.overallAmountUnPaid = overallActual - overallAmountPaid;
        return breakdownList;
    }


}