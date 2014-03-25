angular.module('persistence.company', ['ngResource', 'util.jsonToFormData', 'brandscopicApp.services'])

.factory('companyClient', ['$resource', 'jsonToFormDataFor', 'ApiParams', function($resource, jsonToFormDataFor, ApiParams) {
  var contentType = { 'Accept': 'application/json', 'Content-Type': 'application/x-www-form-urlencoded'}
  return $resource(ApiParams.baseUrl + '/companies/.:format', {auth_token: '@token', format: 'json'},
  {
        'all'     : { method: 'GET', isArray: true }
  });
}]);