angular.module('persistence.company', ['ngResource', 'util.jsonToFormData'])

.factory('companyClient', ['$resource', 'jsonToFormDataFor', function($resource, jsonToFormDataFor) {
  var contentType = { 'Accept': 'application/json', 'Content-Type': 'application/x-www-form-urlencoded'}
  return $resource('//stage.brandscopic.com/api/v1/companies/.:format', {auth_token: '@token', format: 'json'},
  {
        'all'     : { method: 'GET', isArray: true }
  });
}]);