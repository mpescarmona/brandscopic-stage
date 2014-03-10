angular.module('persistence.surveys', ['ngResource', 'util.jsonToFormData'])

.factory('surveysClient', ['$resource', 'jsonToFormDataFor', function($resource, jsonToFormDataFor) {
  var contentType = { 'Accept': 'application/json', 'Content-Type': 'application/x-www-form-urlencoded'}
     ,contentTypeJson = { 'Accept': 'application/json', 'Content-Type': 'application/json'}

  return $resource('//stage.brandscopic.com/api/v1/events/:event_id/surveys.:format', { auth_token: '@token', format: 'json', company_id: '@company_id', event_id: '@event_id' },
  {
      'all'     :   {
                      method: 'GET'
                    , isArray: true
                    }

    , 'create'     :   {
                       method: 'POST'
                     , headers: contentTypeJson
                    }

    , 'update'    : {
                       method: 'PUT'
                     , headers: contentTypeJson
                     , url: '//stage.brandscopic.com/api/v1/events/:event_id/surveys/:id.:format', auth_token: '@token', format: 'json', company_id: '@company_id', event_id: '@event_id', id: '@survey_id'
                    }

    , 'detail'    : {
                      method: 'GET'
                    , url: '//stage.brandscopic.com/api/v1/events/:event_id/surveys/:id.:format', auth_token: '@token', format: 'json', company_id: '@company_id', event_id: '@event_id', id: '@survey_id'
                    }

    , 'brands'    :  {
                          method: 'GET'
                        , isArray: true
                        , url: '//stage.brandscopic.com/api/v1/events/:event_id/surveys/brands.:format', auth_token: '@token', format: 'json', company_id: '@company_id', event_id: '@event_id'
                    }
});
}]);
