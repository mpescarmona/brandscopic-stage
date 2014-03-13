angular.module('model.campaign', ['persistence.campaign'])

  .service('Campaign', ['campaignClient', function (campaignClient) {
    var
       company_id
      , campaign_id
      , collection
      , stats
      , statDetails

      , all = function (credentials, actions) {
          if ('auth_token' in credentials && 'company_id' in credentials && 'success' in actions) {
            if (collection && company_id == credentials.company_id)
              actions.success(collection)
            else {
              company_id = credentials.company_id
              campaignClient.all(credentials, allResponse(actions))
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

      , stats = function (credentials, actions) {
          if ('auth_token' in credentials && 'company_id' in credentials && 'success' in actions) {
            if (stats && company_id == credentials.company_id)
              actions.success(stats)
            else {
              company_id = credentials.company_id
              campaignClient.stats(credentials, statsResponse(actions))
            }
          } else
            throw 'Wrong set of credentials'

      }
      , statsResponse = function (actions) {
          return function(resp){
            if (resp.length) {
              stats = resp
              actions.success(angular.copy(stats))
            }
            else
              throw 'results missing on response'

          }
      }

      , statDetails = function (credentials, actions) {
          if ('auth_token' in credentials && 'company_id' in credentials && 'campaign_id' in credentials && 'success' in actions) {
            if (statDetails && company_id == credentials.company_id && campaign_id == credentials.campaign_id)
              actions.success(statDetails)
            else {
              company_id = credentials.company_id
              campaign_id = credentials.campaign_id
              campaignClient.statDetails(credentials, statDetailsResponse(actions))
            }
          } else
            throw 'Wrong set of credentials'

      }
      , statDetailsResponse = function (actions) {
          return function(resp){
            if (resp.length) {
              statDetails = resp
              actions.success(angular.copy(statDetails))
            }
            else
              throw 'results missing on response'

          }
      }

      return {
          all        : all
        , stats      : stats
        , statDetails: statDetails
      }
  }])