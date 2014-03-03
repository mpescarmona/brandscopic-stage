angular.module('persistence.venue', ['ngResource', 'util.jsonToFormData'])

.factory('venueClient', ['$resource', 'jsonToFormDataFor', function($resource, jsonToFormDataFor) {
  var contentType = { 'Accept': 'application/json', 'Content-Type': 'application/x-www-form-urlencoded'}

  return $resource('//stage.brandscopic.com/api/v1/venues/:venue_id.:format', {auth_token: '@token', format: 'json', company_id: '@company_id', term: '@term'},
  {
        'all'        : { method: 'GET' }

      , 'find'       : { method: 'GET' }

      , 'search'     : { method: 'GET' 
                         , isArray: true
                         , url: '//stage.brandscopic.com/api/v1/venues/search.:format'
                       } 

      , 'comments'    : { method: 'GET' 
                         , isArray: true
                         , url: '//stage.brandscopic.com/api/v1/venues/:venue_id/comments.:format'
                       } 

      , 'photos'      : { method: 'GET' 
                         , isArray: true
                         , url: '//stage.brandscopic.com/api/v1/venues/:venue_id/photos.:format'
                       } 
  });
}]);
