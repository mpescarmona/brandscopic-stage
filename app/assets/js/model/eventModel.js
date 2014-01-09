angular.module('model.event', ['persistence.event'])

  .service('Event', ['eventClient', function(eventClient){
    var
       company_id
      , events
      , filters

      , all = function(credentials, actions){
          if ('auth_token' in credentials && 'company_id' in credentials && 'success' in actions) {
            if (events && company_id == credentials.company_id)
              actions.success(events, filters)
            else {
              company_id = credentials.company_id
              eventClient.all(credentials, allResponse(actions))
            }
          } else
            throw 'Wrong set of credentials'

      }
      , allResponse = function(actions){
          return function(resp){

            if ('facets' in resp && 'results' in resp) {
              events = resp.results
              filters = parseFilters(resp.facets)

              actions.success(events, filters)
            }
            else
              throw 'facets or results missing on respons'

          }
      }
      , parseFilters = function(facets){
          var keyName = 'event status'
          for (var i = 0, facet; facet = facets[i++];)
            if ('label' in facet && keyName == facet.label.toLowerCase())
              if ('items' in facet) return facet.items
      }

      return {
        all: all
      }
  }])
