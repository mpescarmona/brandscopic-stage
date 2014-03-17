angular.module('persistence.user', ['ngResource', 'util.jsonToFormData'])

.factory('userClient', ['$resource', 'jsonToFormDataFor', function($resource, jsonToFormDataFor) {
  var contentType = { 'Accept': 'application/json', 'Content-Type': 'application/x-www-form-urlencoded'}

  return $resource('//stage.brandscopic.com/api/v1/users/:action.:format', {auth_token: '@token', format: 'json', country_id: '@country_id'},
  {
        'permissions'   : {  method: 'GET'
                           , params: {action: 'permissions'}
                          }

      , 'forgotPassword': {  method: 'POST'
      					   , headers: {'Accept': 'application/json'}
	                       , url: '//stage.brandscopic.com/api/v1/users/password/new_password.:format'
                          }

  });
}]);