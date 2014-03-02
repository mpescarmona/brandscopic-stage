angular.module('model.venue', ['persistence.venue'])

  .service('Venue', ['venueClient', function (venueClient) {
    var
        company_id
      , collection
      , filters
      , venue

      , all = function(credentials, actions, options){
          if ('auth_token' in credentials && 'company_id' in credentials && 'success' in actions) {
            if (options && 'force' in options && options.force)
              venueClient.all(credentials, allResponse(actions))
            else
              if (collection && company_id == credentials.company_id)
                actions.success(collection)
              else {
                company_id = credentials.company_id
                venueClient.all(credentials, allResponse(actions))
              }

          } else
              throw 'Wrong set of credentials'

        }
      , allResponse = function (actions) {
          return function(resp){
            if ('results' in resp)
              if ('page' in resp.results && resp.results.page > 1) {
                collection = resp.results
                actions.success(angular.copy(collection), angular.copy(filters))
              }
              else
                if ('facets' in resp && 'results' in resp) {
                  // filters    = parseFilters(resp.facets)
                  filters    = resp.facets
                  collection = resp.results

                  actions.success(angular.copy(collection), angular.copy(filters))
                }
                else
                  throw 'facets or results missing on response'

          }
        }

      , find = function (credentials, actions) {
          if ('auth_token' in credentials && 'company_id' in credentials && 'venue_id' in credentials && 'success' in actions)
            if (venue && venue.id  == credentials.venue_id)
              actions.success(angular.copy(venue))
            else
              venueClient.find(credentials, findResponse(actions))
          else
            throw 'Wrong set of credentials'

        }
      , findResponse = function (actions) {
          return function(resp){
            venue = resp
            actions.success(angular.copy(venue))
          }
        }

      , search = function(credentials, actions){
          if ('auth_token' in credentials && 'company_id' in credentials && 'success' in actions) {
            company_id = credentials.company_id
            venueClient.search(credentials, searchResponse(actions))
          } else
              throw 'Wrong set of credentials'
        }
      , searchResponse = function (actions) {
          return function(resp){
            if (resp.length) {
              actions.success(angular.copy(resp))
            }
            else
              throw 'results missing on response'

          }
        }
    return {
        all   : all
      , find  : find
      , search: search
    }
  }])
