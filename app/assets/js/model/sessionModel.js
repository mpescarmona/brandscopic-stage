angular.module('model.session', ['persistence.session'])

  .service('Session', ['sessionClient', function (sessionClient) {
    var
        login = function (credentials, actions) {
          if ('email' in credentials && 'password' in credentials && 'success' in actions)
            sessionClient.login(credentials, loginResponse(actions), loginErrorResponse(actions))
          else
            throw 'Wrong set of credentials'

      }
      , loginResponse = function (actions) {
          return function(resp){
            if (resp)
              actions.success(angular.copy(resp))
            else
              throw 'results missing on response'

          }
      }
      , loginErrorResponse = function (actions) {
          return function(resp){
            if (resp)
              actions.error(angular.copy(resp))
            else
              throw 'results missing on response'

          }
      }

      , logout = function (credentials, actions) {
          if ('id' in credentials && 'success' in actions)
            sessionClient.logout(credentials, logoutResponse(actions))
          else
            throw 'Wrong set of credentials'

      }
      , logoutResponse = function (actions) {
          return function(resp){
            if (resp)
              actions.success(angular.copy(resp))
            else
              throw 'results missing on response'

          }
      }

      return {
          login : login
        , logout: logout
      }
  }])