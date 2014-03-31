angular.module('model.photos', ['persistence.photos'])

  .service('Photos', ['photosClient', function (photosClient) {
    var
       company_id
      , collection

      , create = function (credentials, actions, attributes) {
          if ('auth_token' in credentials && 'company_id' in credentials && 'success' in actions)
            if (Object.keys(attributes).length)
              photosClient.create(credentials
                                 , attributes
                                 , createResponse(actions.success)
                                 , createResponse(actions.error)
                                )
      }
      , createResponse = function (action) {
          return function (e) {
            if (action) action(e)
          }
      }
      , form = function(credentials, actions) {
          if ('auth_token' in credentials && 'company_id' in credentials && 'success' in actions) {
            company_id = credentials.company_id
            photosClient.form(credentials, formResponse(actions))
          } else
              throw 'Wrong set of credentials'
        }

        , formResponse = function (actions) {
          return function (resp) {
            if (resp) {
              actions.success(angular.copy(resp))
            }
            else
              throw 'results missing on response'
          }
        }

      , all = function(credentials, actions) {
          if ('auth_token' in credentials && 'company_id' in credentials && 'success' in actions) {
            company_id = credentials.company_id
            photosClient.all(credentials, allResponse(actions))
          } else
              throw 'Wrong set of credentials'
        }

        , allResponse = function (actions) {
          return function (resp) {
            if (resp) {
              actions.success(angular.copy(resp))
            }
            else
              throw 'results missing on response'
          }
        }

      , add = function(credentials, actions) {
          if ('auth_token' in credentials && 'company_id' in credentials && 'success' in actions) {
            company_id = credentials.company_id
            photosClient.add(credentials, addResponse(actions))
          } else
              throw 'Wrong set of credentials'
        }

      , addResponse = function (actions) {
          return function (resp) {
            if (resp) {
              actions.success(angular.copy(resp))
            }
            else
              throw 'results missing on response'
          }
        }

      return {
          all    : all
        , add    : add
        , form   : form
        , create : create
      }
  }])
