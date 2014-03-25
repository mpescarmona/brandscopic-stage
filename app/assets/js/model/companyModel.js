angular.module('model.company', ['persistence.company'])

  .service('Company', ['companyClient', function (companyClient) {
    var
        collection

      , all = function (credentials, actions) {
          if ('auth_token' in credentials && 'success' in actions) {
            if (collection)
              actions.success(collection)
            else {
              companyClient.all(credentials, allResponse(actions))
            }
          } else
            throw 'Wrong set of credentials'

      }
      , allResponse = function (actions) {
          return function(resp){
            if (resp.length) {
              collection = resp

              actions.success(angular.copy(collection))
            }
            else
              throw 'results missing on response'

          }
      }

      return {
          all: all
      }
  }])