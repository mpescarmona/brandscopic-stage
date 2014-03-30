angular.module('persistence.venue', ['ngResource', 'util.jsonToFormData', 'brandscopicApp.services'])

.factory('venueClient', ['$resource', 'jsonToFormDataFor', 'ApiParams', function($resource, jsonToFormDataFor, ApiParams) {
  var contentType = { 'Accept': 'application/json', 'Content-Type': 'application/x-www-form-urlencoded'}

  return $resource(ApiParams.baseUrl + '/venues/:venue_id.:format', {auth_token: '@token', format: 'json', company_id: '@company_id', term: '@term'},
  {
        'all'        : { method: 'GET' }

      , 'find'       : { method: 'GET' }

      , 'create'     : { method: 'POST'
                         , headers: contentType
                         , transformRequest: jsonToFormDataFor('venue')
                       }

      , 'search'     : { method: 'GET' 
                         , isArray: true
                         , url: ApiParams.baseUrl + '/venues/search.:format'
                       } 

      , 'types'     : { method: 'GET' 
                         , isArray: true
                         , url: ApiParams.baseUrl + '/venues/types.:format'
                       } 

      , 'analysis'   : { method: 'GET' 
                         , url: ApiParams.baseUrl + '/venues/:venue_id/analysis.:format'
                       } 

      , 'comments'    : { method: 'GET' 
                         , isArray: true
                         , url: ApiParams.baseUrl + '/venues/:venue_id/comments.:format'
                       } 

      , 'photos'      : { method: 'GET' 
                         , isArray: true
                         , url: ApiParams.baseUrl + '/venues/:venue_id/photos.:format'
                       } 

      , 'filterVenues'  : {
                            method: 'GET',
                            url: ApiParams.baseUrl + '/venues.:format', format: 'json', auth_token: '@token', company_id: '@company_id', campaign: '@campaign', brand: '@brand', brand_portfolio: '@brand_portfolio', company_user: '@company_user', team: '@team', area: '@area', page : '@page'
                          }

      , 'venuesAutocomplete':   {
                                  method: 'GET',
                                  isArray: true ,
                                  url: ApiParams.baseUrl + '/venues/autocomplete.:format', format: 'json', auth_token: '@token', company_id: '@company_id', q: '@q'
                                }
  });
}]);
