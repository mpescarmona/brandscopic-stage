
angular.module('persistence.photos', ['ngResource', 'util.jsonToFormData'])

.factory('photosClient', ['$resource', 'jsonToFormDataFor', function($resource, jsonToFormDataFor) {
  var contentType = { 'Accept': 'application/json', 'Content-Type': 'application/x-www-form-urlencoded'}

  return $resource('//stage.brandscopic.com/api/v1/events/1/photos/form.:format', {company_id: '@company_id', format: 'json', auth_token: '@token'},
  {
        'form'     : { method: 'GET' }
  });
}]);