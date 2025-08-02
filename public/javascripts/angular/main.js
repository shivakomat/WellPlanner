'use strict';

var app =
    angular.module('wellPlanner', ['auth0', 'angular-storage', 'angular-jwt', 'ngMaterial', 'ui.router', 'moment-picker']);

app.config(function ($provide, authProvider, $urlRouterProvider, $httpProvider, jwtInterceptorProvider, $sceDelegateProvider) {
        $urlRouterProvider.otherwise('/');

        $sceDelegateProvider.resourceUrlWhitelist([
                // Allow same origin resource loads.
                'self',
                // Allow loading from our assets domain. **.
                'https://*.herokuapp.com/assets/**'
        ]);
});

app.config(['momentPickerProvider', function (momentPickerProvider) {
        momentPickerProvider.options({
                /* Picker properties */
                locale:        'en',
                format:        'L LTS',
                minView:       'decade',
                maxView:       'day',
                startView:     'month',
                autoclose:     true,
                today:         true,
                keyboard:      true,

                /* Extra: Views properties */
                leftArrow:     '&larr;',
                rightArrow:    '&rarr;',
                yearsFormat:   'YYYY',
                monthsFormat:  'MMM',
                daysFormat:    'D',
                hoursFormat:   'HH:[00]',
                minutesFormat: moment.localeData().longDateFormat('LT').replace(/[aA]/, ''),
                secondsFormat: 'ss',
                minutesStep:   5,
                secondsStep:   1
        });
}]);



app.directive('capitalization', function () {
        return {
                require: 'ngModel',
                link: function (scope, element, attrs, modelCtrl) {

                        modelCtrl.$parsers.push(function (inputValue) {

                                var transformedInput = (!!inputValue) ? inputValue.charAt(0).toUpperCase() + inputValue.substr(1).toLowerCase() : '';

                                if (transformedInput != inputValue) {
                                        modelCtrl.$setViewValue(transformedInput);
                                        modelCtrl.$render();
                                }

                                return transformedInput;
                        });
                }
        }
});

app.directive('phoneNumberFormat', function() {
        return {
                require: 'ngModel',
                link: function(scope, element, attrs, modelCtrl) {

                        modelCtrl.$parsers.push(function(number) {
                                var transformedNumber = number;

                                if (number.match(/^\d{4}$/)) {
                                        transformedNumber = number.slice(0, 3) + " " + number.slice(3);
                                }
                                if(number.match(/^[\d\s]{8}$/)){
                                        transformedNumber = number.slice(0, 7) + " " + number.slice(7);
                                }

                                if (number.length > 12) {
                                        transformedNumber = number.slice(0, 12);
                                }
                                if (transformedNumber !== number) {
                                        modelCtrl.$setViewValue(transformedNumber);
                                        modelCtrl.$render();
                                }
                                return transformedNumber;
                        });
                }
        };
});

app.directive('inputCurrency', function ($filter, $locale) {
        var decimalSep = $locale.NUMBER_FORMATS.DECIMAL_SEP;
        var toNumberRegex = new RegExp('[^0-9\\' + decimalSep + ']', 'g');
        var trailingZerosRegex = new RegExp('\\' + decimalSep + '0+$');
        var filterFunc = function (value) {
                return $filter('currency')(value);
        };

        function getCaretPosition(input){
                if (!input) return 0;
                if (input.selectionStart !== undefined) {
                        return input.selectionStart;
                } else if (document.selection) {
                        // Curse you IE
                        input.focus();
                        var selection = document.selection.createRange();
                        selection.moveStart('character', input.value ? -input.value.length : 0);
                        return selection.text.length;
                }
                return 0;
        }

        function setCaretPosition(input, pos){
                if (!input) return 0;
                if (input.offsetWidth === 0 || input.offsetHeight === 0) {
                        return; // Input's hidden
                }
                if (input.setSelectionRange) {
                        input.focus();
                        input.setSelectionRange(pos, pos);
                }
                else if (input.createTextRange) {
                        // Curse you IE
                        var range = input.createTextRange();
                        range.collapse(true);
                        range.moveEnd('character', pos);
                        range.moveStart('character', pos);
                        range.select();
                }
        }

        function toNumber(currencyStr) {
                return parseFloat(currencyStr.replace(toNumberRegex, ''), 10);
        }

        return {
                restrict: 'A',
                require: 'ngModel',
                link: function postLink(scope, elem, attrs, modelCtrl) {
                        modelCtrl.$formatters.push(filterFunc);
                        modelCtrl.$parsers.push(function (newViewValue) {
                                var oldModelValue = modelCtrl.$modelValue;
                                var newModelValue = toNumber(newViewValue);
                                modelCtrl.$viewValue = filterFunc(newModelValue);
                                var pos = getCaretPosition(elem[0]);
                                elem.val(modelCtrl.$viewValue);
                                var newPos = pos + modelCtrl.$viewValue.length -
                                    newViewValue.length;
                                if ((oldModelValue === undefined) || isNaN(oldModelValue)) {
                                        newPos -= 3;
                                }
                                setCaretPosition(elem[0], newPos);
                                return newModelValue;
                        });
                }
        };
});

app.directive('tooltip', function(){
        return {
                restrict: 'A',
                link: function(scope, element, attrs){
                        element.hover(function(){
                                // on mouseenter
                                element.tooltip('show');
                        }, function(){
                                // on mouseleave
                                element.tooltip('hide');
                        });
                }
        };
});

// PROD Constants
// app.constant('config', {
//         appHost: 'https://well-planner-248f4a7d862e.herokuapp.com',
//         appAngularAssets: 'https://well-planner-248f4a7d862e.herokuapp.com/assets/javascripts/angular/'
// });


app.constant('config', {
        appHost: 'http://localhost:9000',
        appAngularAssets: 'http://localhost:9000/assets/javascripts/angular/'
});


// Production base URL
// var baseUrl = "https://well-planner-248f4a7d862e.herokuapp.com/assets/javascripts/angular";

// Dev Base URL
var baseUrl = "http://localhost:9000/assets/javascripts/angular";

app.constant('templates', {
        newProjectModal:  baseUrl + "/newProjectModal.html",
        newTimelineItemListModal: baseUrl + "/newTimelineItemList.html",
        newTimelineItemModal: baseUrl + "/newTimelineItem.html",
        newTaskListModal: baseUrl + "/newTaskListModal.html",
        taskItemsModal: baseUrl + "/taskItemsModal.html",
        newSubTaskModal: baseUrl + "/newSubTaskModal.html",
        deleteTaskListModal: baseUrl + "/deleteTaskListModal.html",
        deleteTimelineItemListModal: baseUrl + "/deleteTimelineItemListModal.html",
        editTaskModal: baseUrl + "/editTaskModal.html",
        editVendorContactModal: baseUrl + "/editVendorModal.html",
        newVendorContactModal: baseUrl + "/newVendorModal.html",
        newTeamMemberModal: baseUrl + "/newTeamMember.html",
        editTeamMemberModal: baseUrl + "/editTeamMember.html",
        editClientModal: baseUrl + "/editClientModal.html",
        newClientModal: baseUrl + "/newClientModal.html",
        newBudgetBreakdownListModal: baseUrl + "/newBudgetBreakdownModal.html",
        newBreakdownItemModal: baseUrl + "/newBreakdownItemModal.html",
        deleteBreakdownsListModal: baseUrl + "/deleteBreakdownListModal.html",
        editBreakdownItemModal: baseUrl + "/editBreakdownItem.html",
        addVendorManageModal: baseUrl + "/newVendorManager.html",
    clientDocumentsModal: baseUrl + "/clientDocumentsModal.html",
});