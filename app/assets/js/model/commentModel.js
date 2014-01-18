angular.module('model.comment', ['persistence.comment'])

  .service('Comment', ['commentClient', function (commentClient) {
    var
       company_id
      , collection

      , all = function (credentials, actions) {
          if ('auth_token' in credentials && 'company_id' in credentials && 'success' in actions) {
            if (collection && company_id == credentials.company_id)
              actions.success(collection)
            else {
              company_id = credentials.company_id
              commentClient.all(credentials, allResponse(actions))
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