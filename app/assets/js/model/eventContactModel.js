angular.module('model.eventContact', ['persistence.eventContact'])

  .service('EventContact', ['eventContactClient', function (eventContactClient) {
    var
       company_id
      , collection
      , event

      , contacts = function (credentials, actions) {
          if ('auth_token' in credentials && 'company_id' in credentials && 'event_id' in credentials && 'success' in actions)
            if (event && event.id  == credentials.event_id)
              actions.success(angular.copy(event))
            else
              eventContactClient.contacts(credentials, contactsResponse(actions))
          else
            throw 'Wrong set of credentials'

      }
      , contactsResponse = function (actions) {
           return function(resp){
             event = resp
             actions.success(angular.copy(event))
           }
      }
      , create = function (credentials, actions, attributes) {
          if ('auth_token' in credentials && 'company_id' in credentials && 'event_id' in credentials && 'success' in actions)
            if (Object.keys(attributes).length)
              eventContactClient.create(credentials
                                 , attributes
                                 , createResponse(actions.success)
                                 , createResponse(actions.error)
                                )
      }
      , createResponse = function (action) {
        return function (resp) {
          if ('id' in resp) {
            event = resp
            collection.push(event)
          }

          var answer = resp.id ? resp : resp.data

          if (action) action(angular.copy(answer))
        }
      }
      , all = function (credentials, actions) {
          if ('auth_token' in credentials && 'company_id' in credentials && 'event_id' in credentials && 'success' in actions) {
            if (collection && company_id == credentials.company_id)
              actions.success(collection, filters)
            else {
              company_id = credentials.company_id
              eventContactClient.all(credentials, allResponse(actions))
            }
          } else
            throw 'Wrong set of credentials'

      }
      , allResponse = function (actions) {
          return function(resp){
            if (resp.length) {
              collection = resp.results

              actions.success(angular.copy(collection))
            }
            else
              throw 'results missing on respons'

          }
      }

      return {
          all: all
        , contacts: contacts
        , create: create
      }
  }])