angular.module('persistence.notification', ['ngResource', 'util.jsonToFormData'])

.factory('notificationClient', ['$resource', 'jsonToFormDataFor', function($resource, jsonToFormDataFor) {
  var contentType = { 'Accept': 'application/json', 'Content-Type': 'application/x-www-form-urlencoded'}
    , contentTypeJson = { 'Accept': 'application/json', 'Content-Type': 'application/json'}

  return $resource('//stage.brandscopic.com/api/v1/users/notifications.:format', {auth_token: '@token', format: 'json', company_id: '@company_id'},
  {
        'all'           : { method: 'GET', isArray: true }
  });
}]);
