angular.module('persistence.campaign', ['ngResource', 'util.jsonToFormData'])

.factory('campaignClient', ['$resource', 'jsonToFormDataFor', function($resource, jsonToFormDataFor) {
  var contentType = { 'Accept': 'application/json', 'Content-Type': 'application/x-www-form-urlencoded'}

  return $resource('//stage.brandscopic.com/api/v1/campaigns/all.:format', {auth_token: '@token', format: 'json', company_id: '@company_id'},
  {
        'all'         : { method: 'GET', isArray: true }

      , 'stats'       : {  method: 'GET' 
                         , isArray: true
                         , url: '//stage.brandscopic.com/api/v1/campaigns/overall_stats.:format'
                        }
      , 'statDetails' : {  method: 'GET' 
                         , isArray: true
                         , url: '//stage.brandscopic.com/api/v1/campaigns/:campaign_id/stats.:format'
                        } 
  });
}]);