angular.module('persistence.user', ['ngResource', 'util.jsonToFormData', 'brandscopicApp.services'])

.factory('userClient', ['$resource', 'jsonToFormDataFor', 'ApiParams', function($resource, jsonToFormDataFor, ApiParams) {
  var contentType = { 'Accept': 'application/json', 'Content-Type': 'application/x-www-form-urlencoded'}

  return $resource(ApiParams.baseUrl + '/users/:action.:format', {auth_token: '@token', format: 'json', country_id: '@country_id'},
  {
        'permissions'   : {  method: 'GET'
                           , params: {action: 'permissions'}
                           , isArray: true
                          }

      , 'forgotPassword': {  method: 'POST'
      					           , headers: {'Accept': 'application/json'}
	                         , url: ApiParams.baseUrl + '/users/password/new_password.:format'
                          }

  });
}]);