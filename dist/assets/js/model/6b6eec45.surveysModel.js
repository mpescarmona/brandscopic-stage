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

      , brands = function(credentials, actions) {
          if ('auth_token' in credentials && 'company_id' in credentials && 'success' in actions) {
            company_id = credentials.company_id
            surveysClient.brands(credentials, brandsResponse(actions))
          } else
              throw 'Wrong set of credentials'
        }

        , brandsResponse = function (actions) {
            return function (resp) {
              if (resp) {
                actions.success(angular.copy(resp))
              }
              else
                throw 'results missing on response'
            }
      }

      , update = function (credentials, actions, attributes) {

          if ('auth_token' in credentials && 'company_id' in credentials && 'id' in credentials && 'success' in actions)
            if (Object.keys(attributes).length)
              surveysClient.update(credentials
                                 , attributes
                                 , updateResponse(actions.success)
                                 , updateResponse(actions.error)
                                )
      }
      , updateResponse = function (action) {
        return function (resp) {
            if (! surveys || surveys && surveys.id == resp.id ) {
              surveys = resp
              collection = undefined
            }

          var answer = resp.id ? resp : resp.data

          if (action) action(angular.copy(answer))
        }
      }

      , detail = function(credentials, actions) {
          if ('auth_token' in credentials && 'company_id' in credentials && 'success' in actions) {
            company_id = credentials.company_id
            surveysClient.detail(credentials, detailResponse(actions))
          } else
              throw 'Wrong set of credentials'
        }

        , detailResponse = function (actions) {
            return function (resp) {
              if (resp) {
                actions.success(angular.copy(resp))
              }
              else
                throw 'results missing on response'

            }
      }

      return {
          all: all
        , brands: brands
        , create: create
        , detail: detail
        , update: update
      }
  }])
