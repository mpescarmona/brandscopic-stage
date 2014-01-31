angular.module('model.eventTeam', ['persistence.eventTeam'])

  .service('EventTeam', ['eventTeamClient', function (eventTeamClient) {
    var
       company_id
      , collection
      , team

      , members = function (credentials, actions) {
          if ('auth_token' in credentials && 'company_id' in credentials && 'event_id' in credentials && 'success' in actions)
            if (team && team.id  == credentials.event_id)
              actions.success(angular.copy(team))
            else
              eventTeamClient.members(credentials, membersResponse(actions))
          else
            throw 'Wrong set of credentials'

      }
      , membersResponse = function (actions) {
           return function(resp){
             team = resp
             actions.success(angular.copy(team))
           }
      }
      , create = function (credentials, actions, attributes) {
          if ('auth_token' in credentials && 'company_id' in credentials && 'event_id' in credentials && 'success' in actions)
            if (Object.keys(attributes).length)
              eventTeamClient.create(credentials
                                 , attributes
                                 , createResponse(actions.success)
                                 , createResponse(actions.error)
                                )
      }
      , createResponse = function (action) {
        return function (resp) {
          if ('id' in resp) {
            team = resp
            collection.push(team)
          } else {
            collection = undefined
          }

          var answer = resp.id ? resp : resp.data

          if (action) action(angular.copy(answer))
        }
      }
      , remove = function (credentials, actions, attributes) {
          if ('auth_token' in credentials && 'company_id' in credentials && 'event_id' in credentials && 'success' in actions)
            if (Object.keys(attributes).length)
              eventTeamClient.delete(credentials
                                 , attributes
                                 , deleteResponse(actions.success)
                                 , deleteResponse(actions.error)
                                )
      }
      , deleteResponse = function (action) {
        return function (resp) {
          team = resp
          collection = undefined

          var answer = resp.id ? resp : resp.data

          if (action) action(angular.copy(answer))
        }
      }
      , all = function (credentials, actions) {
          if ('auth_token' in credentials && 'company_id' in credentials && 'event_id' in credentials && 'success' in actions) {
            if (collection && company_id == credentials.company_id)
              actions.success(collection)
            else {
              company_id = credentials.company_id
              eventTeamClient.all(credentials, allResponse(actions))
            }
          } else
            throw 'Wrong set of credentials'

      }
      , allResponse = function (actions) {
          return function(resp){
            if (resp.length) {
              // collection = resp.results
              collection = resp

              actions.success(angular.copy(collection))
            }
            else
              throw 'results missing on response'

          }
      }

      return {
          all: all
        , members: members
        , create: create
        , delete: remove
      }
  }])