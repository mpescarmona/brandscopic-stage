angular.module('model.contact', ['persistence.contact'])

  .service('Contact', ['contactClient', function (contactClient) {
    var
       company_id
      , contact_id
      , collection
      , contact

      , all = function (credentials, actions) {
          if ('auth_token' in credentials && 'company_id' in credentials && 'contact_id' in credentials && 'success' in actions) {
            if (collection && company_id == credentials.company_id && contact_id == credentials.contact_id)
              actions.success(collection)
            else {
              company_id = credentials.company_id
              contact_id = credentials.contact_id
              contactClient.all(credentials, allResponse(actions))
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

      , find = function (credentials, actions) {
          if ('auth_token' in credentials && 'company_id' in credentials && 'contact_id' in credentials && 'success' in actions)
            if (contact && contact.id  == credentials.contact_id)
              actions.success(angular.copy(contact))
            else
              contactClient.find(credentials, findResponse(actions))
          else
            throw 'Wrong set of credentials'
      }
      , findResponse = function (actions) {
           return function(resp) {
             contact = resp
             actions.success(angular.copy(contact))
           }
      }

      , create = function (credentials, actions, attributes) {
          if ('auth_token' in credentials && 'company_id' in credentials && 'success' in actions)
            if (Object.keys(attributes).length)
              contactClient.create(credentials
                                 , attributes
                                 , createResponse(actions.success)
                                 , createResponse(actions.error)
                                )
      }
      , createResponse = function (action) {
        return function (resp) {
          if ('id' in resp) {
            contact = resp
            collection = undefined
          }

          var answer = resp.id ? resp : resp.data

          if (action) action(angular.copy(answer))
        }
      }

      , update = function (credentials, actions, attributes) {
          if ('auth_token' in credentials && 'company_id' in credentials && 'contact_id' in credentials && 'success' in actions)
            if (Object.keys(attributes).length)
              contactClient.update(credentials
                                 , attributes
                                 , updateResponse(actions.success)
                                 , updateResponse(actions.error)
                                )
      }
      , updateResponse = function (action) {
        return function (resp) {
          if (resp.status == 'Active')
            if (! contact || contact && contact.id == resp.id ) {
              contact = resp
              collection = undefined
            }

          var answer = resp.id ? resp : resp.data

          if (action) action(angular.copy(answer))
        }
      }

      return {
          all: all
        , find: find
        , create: create
        , update: update
      }
  }])