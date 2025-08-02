app.directive('clientDocumentsModal', [ClientDocumentsModalDirective]);
function ClientDocumentsModalDirective() {
  return {
    template: '<ng-include src="getClientDocumentsModalTemplateUrl()"/>',
    scope: {}, // isolate scope
    bindToController: {
      client: '='
    },
    controller: ClientDocumentsModalController,
    controllerAs: 'clientDocsModalCtrl'
  };
}

app.controller('clientDocumentsModalController', ['ClientDocumentsFactory', '$scope', '$rootScope', 'templates', ClientDocumentsModalController]);
function ClientDocumentsModalController(ClientDocumentsFactory, $scope, $rootScope, templates) {
  var ctrl = this;
  // listen for selected client broadcast
  $rootScope.$on('currentClientSet', function(event, client){
    ctrl.client = client;
    ctrl.refresh();
  });
  ctrl.docs = [];
  ctrl.progress = 0;

  $scope.getClientDocumentsModalTemplateUrl = function () {
    return templates.clientDocumentsModal; // make sure this path exists in templates map
  };

  ctrl.refresh = function () {
    if(ctrl.client && ctrl.client.id) {
      ClientDocumentsFactory.list(ctrl.client.id, function (res) {
        ctrl.docs = res.data.data;
      }, function () { console.error('Failed to list'); });
    }
  };

  

  ctrl.onFileSelected = function (element) {
    var file = element.files[0];
    if(!file) return;
    var activeClient = ctrl.client || $scope.client;
    if(!activeClient || !activeClient.id){
      alerts.autoCloseAlert('success-message', 'Please select a client first', '');
      return;
    }
    ClientDocumentsFactory.upload(activeClient.id, file, function success(res) {
      ctrl.progress = 0;
      ctrl.refresh();
      alerts.autoCloseAlert('success-message', 'File uploaded!', '');
    }, function error(res) {
      alerts.autoCloseAlert('success-message', 'Upload failed', res.statusText);
    });
  };

  ctrl.triggerFilePicker = function(){
    document.getElementById('clientDocFile').click();
  };

  ctrl.deleteDoc = function (doc) {
    ClientDocumentsFactory.delete(doc.id, function success() {
      ctrl.docs = ctrl.docs.filter(function(d) { return d.id !== doc.id; });
    }, function error() { alerts.autoCloseAlert('success-message', 'Delete failed', ''); });
  };

  // initialize when modal opens
  $('#clientDocsModal').on('shown.bs.modal', function () {
    ctrl.refresh();
  });
}
