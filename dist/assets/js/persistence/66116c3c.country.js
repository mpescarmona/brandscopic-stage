angular.module('persistence.country', ['ngResource', 'util.jsonToFormData', 'brandscopicApp.services'])

.factory('countryClient', ['$resource', 'jsonToFormDataFor', 'ApiParams', function($resource, jsonToFormDataFor, ApiParams) {
  var contentType = { 'Accept': 'application/json', 'Content-Type': 'application/x-www-form-urlencoded'}
  return $resource(ApiParams.baseUrl + '/countries/:country_id.:format', {auth_token: '@token', format: 'json', country_id: '@country_id'},
  {
        'all'     : { method: 'GET', isArray: true }

      , 'states'    : { method: 'GET' 
                      , isArray: true
                      , url: ApiParams.baseUrl + '/countries/:country_id/states.:format' }

  });
}]);