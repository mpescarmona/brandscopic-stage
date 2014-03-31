angular.module('persistence.eventContact', ['ngResource', 'util.jsonToFormData', 'brandscopicApp.services'])

.factory('eventContactClient', ['$resource', 'jsonToFormDataFor', 'ApiParams', function($resource, jsonToFormDataFor, ApiParams) {
  var contentType = { 'Accept': 'application/json', 'Content-Type': 'application/x-www-form-urlencoded'}

  return $resource(ApiParams.baseUrl + '/events/:event_id/contacts.:format', {auth_token: '@token', format: 'json', company_id: '@company_id'},
  {
        'all'     : { method: 'GET', isArray: true }

      , 'contacts': { method: 'GET'
                      , isArray: true 
                      , url: ApiParams.baseUrl + '/events/:event_id/assignable_contacts.:format'
                    }

      , 'create'  : { method: 'POST'
                     , headers: contentType
                     , transformRequest: jsonToFormDataFor('contact')
                    }

      , 'delete'  : { method: 'DELETE'
                     , headers: contentType
                     , transformRequest: jsonToFormDataFor('contact')
                    }

  });
}]);