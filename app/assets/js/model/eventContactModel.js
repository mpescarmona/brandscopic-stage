angular.module('model.eventContact', ['persistence.eventContact'])

  .service('EventContact', ['eventContactClient', function (eventContactClient) {
    var
       company_id
      , collection
      , contact

      , contacts = function (credentials, actions) {
          if ('auth_token' in credentials && 'company_id' in credentials && 'event_id' in credentials && 'success' in actions)
            if (contact && contact.id  == credentials.event_id)
              actions.success(angular.copy(contact))
            else
              eventContactClient.contacts(credentials, contactsResponse(actions))
          else
            throw 'Wrong set of credentials'

      }
      , contactsResponse = function (actions) {
           return function(resp){
             contact = resp
             actions.success(angular.copy(contact))
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
            contact = resp
            collection.push(contact)
          } else {
            collection = undefined
          }

          var answer = resp.id ? resp : resp.data

          if (action) action(angular.copy(answer))
        }
      }
      , all = function (credentials, actions) {
          if ('auth_token' in credentials && 'company_id' in credentials && 'event_id' in credentials && 'success' in actions) {
            if (collection && company_id == credentials.company_id)
              actions.success(collection)
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
              // collection = resp.results
              collection = resp

              actions.success(angular.copy(collection))
            }
            else
              throw 'results missing on response'

          }
      }

      return {
          all: all
        , contacts: contacts
        , create: create
      }
  }])