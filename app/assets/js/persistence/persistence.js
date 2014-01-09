angular.module('persistence.event', ['ngResource', 'util.jsonToFormData'])

.factory('eventClient', ['$resource', 'jsonToFormDataFor', function($resource, jsonToFormDataFor) {
  return $resource('//stage.brandscopic.com/api/v1/events/:id.:format', {auth_token: '@token', format: 'json', company_id: '@company_id'},
  {
        'all'     : { method: 'GET' }

      , 'find'    : { method: 'GET' }

      , 'create'  : { method: 'POST'
                     , headers: { 'Accept': 'application/json', 'Content-Type': 'application/x-www-form-urlencoded'}
                     , transformRequest: jsonToFormDataFor('event')
                    }

      , 'save'    : { method: 'PUT'
                     , headers: { 'Accept': 'application/json', 'Content-Type': 'application/x-www-form-urlencoded'}
                     , transformRequest: jsonToFormDataFor('event')
                    }
  });
}]);