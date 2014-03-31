angular.module('persistence.eventTeam', ['ngResource', 'util.jsonToFormData', 'brandscopicApp.services'])

.factory('eventTeamClient', ['$resource', 'jsonToFormDataFor', 'ApiParams', function($resource, jsonToFormDataFor, ApiParams) {
  var contentType = { 'Accept': 'application/json', 'Content-Type': 'application/x-www-form-urlencoded'}

  return $resource(ApiParams.baseUrl + '/events/:event_id/members.:format', {auth_token: '@token', format: 'json', company_id: '@company_id'},
  {
        'all'     : { method: 'GET', isArray: true }

      , 'members' : { method: 'GET'
                      , isArray: true 
                      , url: ApiParams.baseUrl + '/events/:event_id/assignable_members.:format'
                    }

      , 'create'  : { method: 'POST'
                     , headers: contentType
                     , transformRequest: jsonToFormDataFor('team')
                    }

      , 'delete'  : { method: 'DELETE'
                     , headers: contentType
                     , transformRequest: jsonToFormDataFor('team')
                    }

  });
}]);