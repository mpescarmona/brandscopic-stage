angular.module('persistence.expense', ['ngResource', 'util.jsonToFormData', 'brandscopicApp.services'])

.factory('expenseClient', ['$resource', 'jsonToFormDataFor', 'ApiParams', function($resource, jsonToFormDataFor, ApiParams) {
  var contentType = { 'Accept': 'application/json', 'Content-Type': 'application/x-www-form-urlencoded'}

  return $resource(ApiParams.baseUrl + '/events/:event_id/event_expenses.:format', {auth_token: '@token', format: 'json', company_id: '@company_id', event_id: '@event_id'},
  {
        'all'     : { method: 'GET', isArray: true }

      , 'create'  : { method: 'POST'
                     , headers: contentType
                     , transformRequest: jsonToFormDataFor('event_expense', true)
                    }

  });
}]);
