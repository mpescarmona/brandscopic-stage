angular.module('persistence.event', ['ngResource', 'util.jsonToFormData'])

.factory('eventClient', ['$resource', 'jsonToFormDataFor', function($resource, jsonToFormDataFor) {
  var contentType = { 'Accept': 'application/json', 'Content-Type': 'application/x-www-form-urlencoded'}
    , contentTypeJson = { 'Accept': 'application/json', 'Content-Type': 'application/json'}

  return $resource('//stage.brandscopic.com/api/v1/events/:event_id.:format', {auth_token: '@token', format: 'json', company_id: '@company_id', start_date: '@start_date', end_date: '@end_date'},
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
                            url: '//stage.brandscopic.com/api/v1/events/autocomplete.:format', format: 'json', auth_token: '@token', company_id: '@company_id', q: '@q'
                          }

      , 'filterEvents'        : {
                            method: 'GET',
                            url: '//stage.brandscopic.com/api/v1/events.:format', format: 'json', auth_token: '@token', company_id: '@company_id', campaign: '@campaign', place: '@place', user: '@user', brand: '@brand', event_status: '@event_status'
                          }

      , 'results'       : {
                              method: 'GET'
                            , isArray: true
                            , url: '//stage.brandscopic.com/api/v1/events/:event_id/results.:format'
                          }

      , 'brands'    :   {
                            method: 'GET'
                          , isArray: true
                          , url: '//stage.brandscopic.com/api/v1/events/:event_id/surveys/brands.:format', auth_token: '@token', format: 'json', company_id: '@company_id', event_id: '@event_id'
                      }
  });
}]);
