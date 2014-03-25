angular.module('persistence.event', ['ngResource', 'util.jsonToFormData', 'brandscopicApp.services'])

.factory('eventClient', ['$resource', 'jsonToFormDataFor', 'ApiParams', function($resource, jsonToFormDataFor, ApiParams) {
  var contentType = { 'Accept': 'application/json', 'Content-Type': 'application/x-www-form-urlencoded'}
    , contentTypeJson = { 'Accept': 'application/json', 'Content-Type': 'application/json'}
  return $resource(ApiParams.baseUrl + '/events/:event_id.:format', {auth_token: '@token', format: 'json', company_id: '@company_id', start_date: '@start_date', end_date: '@end_date'},
  {
        'all'           : { method: 'GET' }

      , 'find'          : { method: 'GET' }

      , 'create'        : { method: 'POST'
                           , headers: contentType
                           , transformRequest: jsonToFormDataFor('event')
                          }

      , 'update'        : { method: 'PUT'
                           , headers: contentType
                           , transformRequest: jsonToFormDataFor('event')
                          }

      , 'updateResults' : { method: 'PUT'
                           , headers: contentTypeJson
                          }

      , 'search'        : {
                            method: 'GET',
                            isArray: true ,
                            url: ApiParams.baseUrl + '/events/autocomplete.:format', format: 'json', auth_token: '@token', company_id: '@company_id', q: '@q'
                          }

      , 'filterEvents'  : {
                            method: 'GET',
                            url: ApiParams.baseUrl + '/events.:format', format: 'json', auth_token: '@token', company_id: '@company_id', campaign: '@campaign', place: '@place', user: '@user', brand: '@brand', event_status: '@event_status'
                          }

      , 'results'       : {
                            method: 'GET'
                           , isArray: true
                           , url: ApiParams.baseUrl + '/events/:event_id/results.:format'
                          }
  });
}]);
