angular.module('persistence.session', ['ngResource', 'util.jsonToFormData'])

.factory('sessionClient', ['$resource', 'jsonToFormDataFor', function($resource, jsonToFormDataFor) {
  var contentType = { 'Accept': 'application/json', 'Content-Type': 'application/x-www-form-urlencoded'}

  return $resource('//stage.brandscopic.com/api/v1/sessions.:format', {auth_token: '@token', format: 'json'},
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