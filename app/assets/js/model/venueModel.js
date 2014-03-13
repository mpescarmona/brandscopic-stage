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

      , create = function (credentials, actions, attributes) {
          console.log(attributes)
          if ('auth_token' in credentials && 'company_id' in credentials && 'success' in actions)
            if (Object.keys(attributes).length)
              venueClient.create(credentials
                                 , attributes
                                 , createResponse(actions.success)
                                 , createResponse(actions.error)
                                )
        }
      , createResponse = function (action) {
        return function (resp) {
          if ('id' in resp) {
            venue = resp
            collection.push(venue)
          }

          var answer = resp.id ? resp : resp.data

          if (action) action(angular.copy(answer))
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

      , types = function(credentials, actions){
          if ('auth_token' in credentials && 'company_id' in credentials && 'success' in actions) {
            company_id = credentials.company_id
            venueClient.types(credentials, typesResponse(actions))
          } else
              throw 'Wrong set of credentials'
        }
      , typesResponse = function (actions) {
          return function(resp){
            if (resp.length) {
              actions.success(angular.copy(resp))
            }
            else
              throw 'results missing on response'

          }
        }

      , analysis = function (credentials, actions) {
          if ('auth_token' in credentials && 'company_id' in credentials && 'venue_id' in credentials && 'success' in actions)
            venueClient.analysis(credentials, analysisResponse(actions))
          else
            throw 'Wrong set of credentials'

        }
      , analysisResponse = function (actions) {
          return function(resp){
            venue = resp
            actions.success(angular.copy(venue))
          }
        }

      , comments = function (credentials, actions) {
          if ('auth_token' in credentials && 'company_id' in credentials && 'venue_id' in credentials && 'success' in actions)
            venueClient.comments(credentials, commentsResponse(actions))
          else
            throw 'Wrong set of credentials'

        }
      , commentsResponse = function (actions) {
          return function(resp){
            venue = resp
            actions.success(angular.copy(venue))
          }
        }

      , photos = function (credentials, actions) {
          if ('auth_token' in credentials && 'company_id' in credentials && 'venue_id' in credentials && 'success' in actions)
            venueClient.photos(credentials, photosResponse(actions))
          else
            throw 'Wrong set of credentials'

        }
      , photosResponse = function (actions) {
          return function(resp){
            venue = resp
            actions.success(angular.copy(venue))
          }
        }
      , filterVenues = function(credentials, actions) {
          if ('auth_token' in credentials && 'company_id' in credentials && 'success' in actions) {
            company_id = credentials.company_id
            venueClient.filterVenues(credentials, filterVenuesResponse(actions))
          } else
              throw 'Wrong set of credentials'
        }

        , filterVenuesResponse = function (actions) {
            return function (resp) {
              if (resp) {
                actions.success(angular.copy(resp))
              }
              else
                throw 'results missing on response'
            }
        }

    return {
        all     : all
      , find    : find
      , create  : create
      , search  : search
      , types   : types
      , analysis: analysis
      , comments: comments
      , photos  : photos
      , filterVenues: filterVenues
    }
  }])
