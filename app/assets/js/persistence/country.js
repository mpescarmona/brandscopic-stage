angular.module('persistence.country', ['ngResource', 'util.jsonToFormData'])

.factory('countryClient', ['$resource', 'jsonToFormDataFor', function($resource, jsonToFormDataFor) {
  var contentType = { 'Accept': 'application/json', 'Content-Type': 'application/x-www-form-urlencoded'}
  return $resource('//stage.brandscopic.com/api/v1/countries/:country_id.:format', {auth_token: '@token', format: 'json', country_id: '@country_id'},
  {
        'all'     : { method: 'GET', isArray: true }

      , 'states'    : { method: 'GET' 
                      , isArray: true
                      , url: '//stage.brandscopic.com/api/v1/countries/:country_id/states.:format' }

  });
}]);