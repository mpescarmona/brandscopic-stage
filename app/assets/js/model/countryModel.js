angular.module('model.country', ['persistence.country'])

  .service('Country', ['countryClient', function (countryClient) {
    var
        country_id
      , collection
      , states

      , all = function (credentials, actions) {
          if ('auth_token' in credentials && 'success' in actions) {
            if (collection)
              actions.success(collection)
            else {
              // country_id = credentials.country_id
              countryClient.all(credentials, allResponse(actions))
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

      , states = function (credentials, actions) {
          if ('auth_token' in credentials && 'country_id' in credentials && 'success' in actions)
            if (states && country_id  == credentials.country_id)
              actions.success(angular.copy(states))
            else {
              country_id = credentials.country_id
              countryClient.states(credentials, statesResponse(actions))
            }
          else
            throw 'Wrong set of credentials'

      }
      , statesResponse = function (actions) {
           return function(resp){
             states = resp
             actions.success(angular.copy(states))
           }
      }

      return {
          all: all
        , states: states
      }
  }])