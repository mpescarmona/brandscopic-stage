angular.module('persistence.session', ['ngResource', 'util.jsonToFormData', 'brandscopicApp.services'])

.factory('sessionClient', ['$resource', 'jsonToFormDataFor', 'ApiParams', function($resource, jsonToFormDataFor, ApiParams) {
  var contentType = { 'Accept': 'application/json', 'Content-Type': 'application/x-www-form-urlencoded'}

  return $resource(ApiParams.baseUrl + '/sessions.:format', {auth_token: '@token', format: 'json'},
  {
        'login'   : {  method: 'POST'
					           , headers: {'Accept': 'application/json'}
                     , params: {email: '@email', password: '@password'}
                    }

      , 'logout'  : {  method: 'DELETE'
                     , headers: {'Accept': 'application/json'}
                     , params: {id: '@token'}
                    }

  });
}]);