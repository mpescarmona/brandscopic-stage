angular.module('persistence.photos', ['ngResource', 'util.jsonToFormData', 'brandscopicApp.services'])

.factory('photosClient', ['$resource', 'jsonToFormDataFor', 'ApiParams', function($resource, jsonToFormDataFor, ApiParams) {
  var contentType = { 'Accept': 'application/json', 'Content-Type': 'application/x-www-form-urlencoded'}

  return $resource(ApiParams.baseUrl + '/events/:event_id/photos/:photo_id.:format', {company_id: '@company_id', format: 'json', auth_token: '@token'},
  {
      'all'     :   { method: 'GET' }

    , 'add'     :   {
                       method: 'POST'
                     , headers: contentType
                     , transformRequest: jsonToFormDataFor('comment')
                    }

    , 'form'    :   {
                       method: 'GET'
                     , url: ApiParams.baseUrl + '/events/:event_id/photos/form.:format', company_id: '@company_id', format: 'json', auth_token: '@token'
                    }
    , 'create'    : {
                       method: 'POST'
                     , headers: contentType
                     , transformRequest: jsonToFormDataFor('attached_asset')
                    }
  });
}]);
