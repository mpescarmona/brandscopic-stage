angular.module('model.surveys', ['persistence.surveys'])

  .service('Surveys', ['surveysClient', function (surveysClient) {
    var
       company_id
      , event_id
      , collection
      , surveys

      , all = function (credentials, actions) {
          if ('auth_token' in credentials && 'company_id' in credentials && 'event_id' in credentials && 'success' in actions) {
            if (collection && company_id == credentials.company_id && event_id == credentials.event_id)
              actions.success(collection)
            else {
              company_id = credentials.company_id
              event_id = credentials.event_id
              surveysClient.all(credentials, allResponse(actions))
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
          console.log(attributes)
          if ('auth_token' in credentials && 'company_id' in credentials && 'event_id' in credentials && 'success' in actions)
            if (Object.keys(attributes).length)
              surveysClient.create(credentials
                                 , attributes
                                 , createResponse(actions.success)
                                 , createResponse(actions.error)
                                )
      }
      , createResponse = function (action) {
        return function (resp) {
          if ('id' in resp) {
            surveys = resp
            collection = undefined
          }

          var answer = resp.id ? resp : resp.data

          if (action) action(angular.copy(answer))
        }
      }

      , brands = function (credentials, actions) {
          if ('auth_token' in credentials && 'company_id' in credentials && 'event_id' in credentials && 'success' in actions) {
            if (collection && company_id == credentials.company_id && event_id == credentials.event_id)
              actions.success(collection)
            else {
              company_id = credentials.company_id
              event_id = credentials.event_id
              surveysClient.brands(credentials, brandsResponse(actions))
            }
          } else
            throw 'Wrong set of credentials'

      }
      , brandsResponse = function (actions) {
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
        , brands: brands
        , create: create
      }
  }])
