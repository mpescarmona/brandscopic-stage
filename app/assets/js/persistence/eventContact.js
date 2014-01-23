angular.module('persistence.eventContact', ['ngResource', 'util.jsonToFormData'])

.factory('eventContactClient', ['$resource', 'jsonToFormDataFor', function($resource, jsonToFormDataFor) {
  var contentType = { 'Accept': 'application/json', 'Content-Type': 'application/x-www-form-urlencoded'}

  return $resource('//stage.brandscopic.com/api/v1/events/:event_id/contacts.:format', {auth_token: '@token', format: 'json', company_id: '@company_id'},
  {
        'all'     : { method: 'GET', isArray: true }

      , 'contacts': { method: 'GET'
                      , isArray: true 
                      , url: '//stage.brandscopic.com/api/v1/events/:event_id/assignable_contacts.:format'
                    }

      , 'create'  : { method: 'POST'
                     , headers: contentType
                     , transformRequest: jsonToFormDataFor('contact')
                    }

  });
}]);