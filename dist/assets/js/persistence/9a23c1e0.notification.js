angular.module('persistence.notification', ['ngResource', 'util.jsonToFormData', 'brandscopicApp.services'])

.factory('notificationClient', ['$resource', 'jsonToFormDataFor', 'ApiParams', function($resource, jsonToFormDataFor, ApiParams) {
  var contentType = { 'Accept': 'application/json', 'Content-Type': 'application/x-www-form-urlencoded'}
    , contentTypeJson = { 'Accept': 'application/json', 'Content-Type': 'application/json'}
  return $resource(ApiParams.baseUrl + '/users/notifications.:format', {auth_token: '@token', format: 'json', company_id: '@company_id'},
  {
        'all'           : { method: 'GET', isArray: true }
  });
}]);
