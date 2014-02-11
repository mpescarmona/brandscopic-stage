
angular.module('persistence.photos', ['ngResource', 'util.jsonToFormData'])

.factory('photosClient', ['$resource', 'jsonToFormDataFor', function($resource, jsonToFormDataFor) {
  var contentType = { 'Accept': 'application/json', 'Content-Type': 'application/x-www-form-urlencoded'}

  return $resource('//stage.brandscopic.com/api/v1/events/:event_id/photos/', {company_id: '@company_id', format: 'json', auth_token: '@token'},
  {
      'all'     :   { method: 'GET' }

    , 'add'     :   {
                       method: 'POST'
                     , headers: contentType
                     , transformRequest: jsonToFormDataFor('comment')
                    }

    , 'form'    :   {
                       method: 'GET'
                     , url: '//stage.brandscopic.com/api/v1/events/:event_id/photos/form.:format', company_id: '@company_id', format: 'json', auth_token: '@token'
                    }
  });
}]);