angular.module('persistence.eventTeam', ['ngResource', 'util.jsonToFormData'])

.factory('eventTeamClient', ['$resource', 'jsonToFormDataFor', function($resource, jsonToFormDataFor) {
  var contentType = { 'Accept': 'application/json', 'Content-Type': 'application/x-www-form-urlencoded'}

  return $resource('//stage.brandscopic.com/api/v1/events/:event_id/members.:format', {auth_token: '@token', format: 'json', company_id: '@company_id'},
  {
        'all'     : { method: 'GET', isArray: true }

      , 'members' : { method: 'GET'
                      , isArray: true 
                      , url: '//stage.brandscopic.com/api/v1/events/:event_id/assignable_members.:format'
                    }

      , 'create'  : { method: 'POST'
                     , headers: contentType
                     , transformRequest: jsonToFormDataFor('team')
                    }

  });
}]);