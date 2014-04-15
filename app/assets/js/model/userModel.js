angular.module('model.user', ['persistence.user'])

  .service('User', ['userClient', function (userClient) {
    var
        company_id
      , permissions

      , permissions = function (credentials, actions) {
          if ('auth_token' in credentials && 'company_id' in credentials && 'success' in actions) {
            if (permissions && company_id == credentials.company_id)
              actions.success(permissions)
            else {
              userClient.permissions(credentials, permissionsResponse(actions))
            }
          } else
            throw 'Wrong set of credentials'

      }
      , permissionsResponse = function (actions) {
          return function(resp){
            if (resp.length) {
              var permissions = []
              for (var i = 0, action, item; action = resp[i++];){
                item = ''
                for (var j = 0, aux; aux = action[j++];){
                  item = item + aux
                }
                permissions.push(item)
              }
              actions.success(angular.copy(permissions))
            }
            else
              throw 'results missing on response'

          }
      }

      , forgotPassword = function (credentials, actions) {
          if ('email' in credentials && 'success' in actions)
            userClient.forgotPassword(credentials, forgotPasswordResponse(actions), forgotPasswordErrorResponse(actions))
          else
            throw 'Wrong set of credentials'

      }
      , forgotPasswordResponse = function (actions) {
          return function(resp){
            if (resp)
              actions.success(angular.copy(resp))
            else
              throw 'results missing on response'

          }
      }
      , forgotPasswordErrorResponse = function (actions) {
          return function(resp){
            if (resp)
              actions.error(angular.copy(resp))
            else
              throw 'results missing on response'

          }
      }

      return {
          permissions   : permissions
        , forgotPassword: forgotPassword
      }
  }])