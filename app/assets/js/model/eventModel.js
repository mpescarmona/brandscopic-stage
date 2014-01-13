angular.module('model.event', ['persistence.event'])

  .service('Event', ['eventClient', function (eventClient) {
    var
       company_id
      , collection
      , filters
      , event

      , find = function (credentials, actions) {
          if ('auth_token' in credentials && 'company_id' in credentials && 'event_id' in credentials && 'success' in actions)
            if (event && event.id  == credentials.event_id)
              actions.success(angular.copy(event))
            else
              eventClient.find(credentials, findResponse(actions))
          else
            throw 'Wrong set of credentials'

      }
      , findResponse = function (actions) {
           return function(resp){
             event = resp
             actions.success(angular.copy(event))
           }
      }
      , create = function (credentials, actions, attributes) {
          if ('auth_token' in credentials && 'company_id' in credentials && 'event_id' in credentials && 'success' in actions)
            if (Object.keys(attributes).length)
              eventClient.update(credentials
                                 , attributes
                                 , updateResponse(actions.success)
                                 , updateResponse(actions.error)
                                )
      }
      , createResponse = function (action) {
        return function (resp) {
          if (resp.status == 'Active')
            if (! event || event && event.id == resp.id )
              event = resp

          var answer = resp.id ? resp : resp.data

          if (action) action(angular.copy(answer))
        }
      }
      , update = function (credentials, actions, attributes) {
          if ('auth_token' in credentials && 'company_id' in credentials && 'event_id' in credentials && 'success' in actions)
            if (Object.keys(attributes).length)
              eventClient.update(credentials
                                 , attributes
                                 , updateResponse(actions.success)
                                 , updateResponse(actions.error)
                                )
      }
      , updateResponse = function (action) {
        return function (resp) {
          if (resp.status == 'Active')
            if (! event || event && event.id == resp.id )
              event = resp

          var answer = resp.id ? resp : resp.data

          if (action) action(angular.copy(answer))
        }
      }
      , all = function (credentials, actions) {
          if ('auth_token' in credentials && 'company_id' in credentials && 'success' in actions) {
            if (collection && company_id == credentials.company_id)
              actions.success(collection, filters)
            else {
              company_id = credentials.company_id
              eventClient.all(credentials, allResponse(actions))
            }
          } else
            throw 'Wrong set of credentials'

      }
      , allResponse = function (actions) {
          return function(resp){
            if ('facets' in resp && 'results' in resp) {
              filters    = parseFilters(resp.facets)
              collection = resp.results

              actions.success(angular.copy(collection), angular.copy(filters))
            }
            else
              throw 'facets or results missing on respons'

          }
      }
      , parseFilters = function (facets) {
          var keyName = 'event status'
          for (var i = 0, facet; facet = facets[i++];)
            if ('label' in facet && keyName == facet.label.toLowerCase())
              if ('items' in facet) return facet.items
      }

      return {
          all: all
        , find: find
        , create: create
        , update: update
      }
  }])