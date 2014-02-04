angular.module('model.photos', ['persistence.photos'])

  .service('Photos', ['photosClient', function (photosClient) {
    var
       company_id
      , collection

      , form = function(credentials, actions) {
          if ('auth_token' in credentials && 'company_id' in credentials && 'success' in actions) {
            company_id = credentials.company_id
            photosClient.form(credentials, formResponse(actions))
          } else
              throw 'Wrong set of credentials'
        }

        , formResponse = function (actions) {
          return function (resp) {
            if (resp) {
              actions.success(angular.copy(resp))
            }
            else
              throw 'results missing on response'
          }
        }

      return {
          form: form
      }
  }])