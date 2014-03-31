angular.module('persistence.contact', ['ngResource', 'util.jsonToFormData', 'brandscopicApp.services'])

.factory('contactClient', ['$resource', 'jsonToFormDataFor', 'ApiParams', function($resource, jsonToFormDataFor, ApiParams) {
  var contentType = { 'Accept': 'application/json', 'Content-Type': 'application/x-www-form-urlencoded'}
  return $resource(ApiParams.baseUrl + '/contacts/:contact_id.:format', {auth_token: '@token', format: 'json', company_id: '@company_id', contact_id: '@contact_id'},
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