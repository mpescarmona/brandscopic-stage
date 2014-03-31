angular.module('persistence.comment', ['ngResource', 'util.jsonToFormData', 'brandscopicApp.services'])

.factory('commentClient', ['$resource', 'jsonToFormDataFor', 'ApiParams', function($resource, jsonToFormDataFor, ApiParams) {
  var contentType = { 'Accept': 'application/json', 'Content-Type': 'application/x-www-form-urlencoded'}
  return $resource(ApiParams.baseUrl + '/events/:event_id/comments.:format', {auth_token: '@token', format: 'json', company_id: '@company_id', event_id: '@event_id'},
  {
        'all'     : { method: 'GET', isArray: true }

      , 'create'  : { method: 'POST'
                     , headers: contentType
                     , transformRequest: jsonToFormDataFor('comment')
                    }

  });
}]);