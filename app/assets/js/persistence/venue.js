angular.module('persistence.venue', ['ngResource', 'util.jsonToFormData'])

.factory('venueClient', ['$resource', 'jsonToFormDataFor', function($resource, jsonToFormDataFor) {
  var contentType = { 'Accept': 'application/json', 'Content-Type': 'application/x-www-form-urlencoded'}

  return $resource('//stage.brandscopic.com/api/v1/venues/:action.:format', {auth_token: '@token', format: 'json', company_id: '@company_id', term: '@term'},
  {
        'search'     : { method: 'GET', params: {action:'search'}, isArray: true }
  });
}]);
