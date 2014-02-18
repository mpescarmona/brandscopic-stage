angular.module('persistence.surveys', ['ngResource', 'util.jsonToFormData'])

.factory('surveysClient', ['$resource', 'jsonToFormDataFor', function($resource, jsonToFormDataFor) {
  var contentType = { 'Accept': 'application/json', 'Content-Type': 'application/x-www-form-urlencoded'}

  return $resource('//stage.brandscopic.com/api/v1/events/:event_id/surveys.:format', {auth_token: '@token', format: 'json', company_id: '@company_id', event_id: '@event_id'},
  {
        'all'     : { method: 'GET', isArray: true }

      , 'create'  : { method: 'POST'
                     , headers: contentType
                     , transformRequest: jsonToFormDataFor('survey')
                    }

  });
}]);