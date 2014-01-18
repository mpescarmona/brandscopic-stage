angular.module('model.comment', ['persistence.comment'])

  .service('Comment', ['commentClient', function (commentClient) {
    var
       company_id
      , collection
      , comment

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

      , create = function (credentials, actions, attributes) {
          if ('auth_token' in credentials && 'company_id' in credentials && 'success' in actions)
            if (Object.keys(attributes).length)
              commentClient.create(credentials
                                 , attributes
                                 , createResponse(actions.success)
                                 , createResponse(actions.error)
                                )
      }
      , createResponse = function (action) {
        return function (resp) {
          if (resp.length)
            if ('id' in resp) {
              comment = resp
              collection.push(comment)
            }

          var answer = resp.id ? resp : resp.data

          if (action) action(angular.copy(answer))
        }
      }


      return {
          all: all
        , create: create
      }
  }])