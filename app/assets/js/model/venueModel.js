angular.module('model.venue', ['persistence.venue'])

  .service('Venue', ['venueClient', function (venueClient) {
    var
        search = function(credentials, actions){
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
      search: search
    }
  }])
