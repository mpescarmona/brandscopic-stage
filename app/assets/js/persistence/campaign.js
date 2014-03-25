angular.module('persistence.campaign', ['ngResource', 'util.jsonToFormData', 'brandscopicApp.services'])

.factory('campaignClient', ['$resource', 'jsonToFormDataFor', 'ApiParams', function($resource, jsonToFormDataFor, ApiParams) {
  var contentType = { 'Accept': 'application/json', 'Content-Type': 'application/x-www-form-urlencoded'}
  return $resource(ApiParams.baseUrl + '/campaigns/all.:format', {auth_token: '@token', format: 'json', company_id: '@company_id'},
  {
        'all'         : { method: 'GET', isArray: true }

      , 'stats'       : {  method: 'GET' 
                         , isArray: true
                         , url: ApiParams.baseUrl + '/campaigns/overall_stats.:format'
                        }
      , 'statDetails' : {  method: 'GET' 
                         , isArray: true
                         , url: ApiParams.baseUrl + '/campaigns/:campaign_id/stats.:format'
                        } 
  });
}]);