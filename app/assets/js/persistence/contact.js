angular.module('persistence.contact', ['ngResource', 'util.jsonToFormData'])

.factory('contactClient', ['$resource', 'jsonToFormDataFor', function($resource, jsonToFormDataFor) {
  var contentType = { 'Accept': 'application/json', 'Content-Type': 'application/x-www-form-urlencoded'}
  return $resource('//stage.brandscopic.com/api/v1/contacts/:contact_id.:format', {auth_token: '@token', format: 'json', company_id: '@company_id', contact_id: '@contact_id'},
  {
        'all'     : { method: 'GET', isArray: true }

      , 'find'    : { method: 'GET' }

      , 'create'  : { method: 'POST'
                     , headers: contentType
                     , transformRequest: jsonToFormDataFor('contact')
                    }

      , 'update'    : { method: 'PUT'
                     , headers: contentType
                     , transformRequest: jsonToFormDataFor('contact')
                    }

  });
}]);