app.factory('ClientDocumentsFactory', function($http) {
    var baseApi = '/api';

    return {
        list: function(clientId, success, error) {
            $http.get(baseApi + '/clients/' + clientId + '/documents').then(success, error);
        },
        upload: function(clientId, file, success, error) {
            var formData = new FormData();
            formData.append('file', file);
            $http.post(baseApi + '/clients/' + clientId + '/documents', formData, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            }).then(success, error);
        },
        delete: function(docId, success, error) {
            $http.delete(baseApi + '/documents/' + docId).then(success, error);
        }
    };
});
