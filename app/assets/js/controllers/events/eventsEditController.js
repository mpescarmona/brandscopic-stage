var module = angular.module('brandscopicApp.controllers')
  , controller = function($scope, $state, $stateParams, $location, snapRemote, UserService, CompanyService, UserInterface, Event, Campaign, PermissionsHandler) {

    if( !UserService.isLogged() ) {
      $state.go('login')
      return
    }
    snapRemote.close()

    $scope.event = {}

    var
        ui = {hasMenuIcon: false, hasDeleteIcon: true, hasBackIcon: false, hasMagnifierIcon: false, hasAddIcon: false, hasAddPhoto: false, hasSaveIcon: true, hasEditSurveyIcon: false, hasCancelIcon: false, hasCloseIcon: false, showEventSubNav: true, hasCustomHomeClass: false, searching: false, actionSave: 'updateEvent(' + $scope.event + ')'}
      , credentials = { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token, event_id: $stateParams.eventId }
      , actions = { success: function(event) {
                                    $scope.event = event

                                    var
                                        credentials = { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token }
                                      , actions = { success: function(campaigns) {
                                                                  $scope.campaigns = campaigns
                                                                // Options for User Interface in home partial
                                                                  ui.title = event.campaign ? event.campaign.name : "Event"
                                                                  angular.extend(UserInterface, ui)
                                                                  $scope.UserInterface = UserInterface
                                                                  $scope.eventId = $stateParams.eventId
                                                                  $scope.editUrl = "#/home/events/" + $stateParams.eventId + "/edit"
                                                             }
                                      }
                                    Campaign.all(credentials, actions)
                             }
        }

    $scope.updateEvent = function() {
      var
          credentials = { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token, event_id: $stateParams.eventId }
        , actions = { success: function (event) {
                            $scope.event = event
                            $state.go('home.events')
                      }
                    , error: function (event_error) {
                        $scope.event_error = event_error
                         console.log(event_error)
                      }
                    }
        , sm1 = $scope.event.start_date.indexOf('-')
        , sm2 = $scope.event.start_date.indexOf('/')
        , em1 = $scope.event.end_date.indexOf('-')
        , em2 = $scope.event.end_date.indexOf('/')
      if (sm1 == 4)
        $scope.event.start_date = $scope.event.start_date.replace(/^(\d{4})\-(\d{2})\-(\d{2}).*$/, '$2/$3/$1')
      if (sm2 == 4)
        $scope.event.start_date = $scope.event.start_date.replace(/^(\d{4})\/(\d{2})\/(\d{2}).*$/, '$2/$3/$1')
      if (em1 == 4)
        $scope.event.end_date = $scope.event.end_date.replace(/^(\d{4})\-(\d{2})\-(\d{2}).*$/, '$2/$3/$1')
      if (em2 == 4)
        $scope.event.end_date = $scope.event.end_date.replace(/^(\d{4})\/(\d{2})\/(\d{2}).*$/, '$2/$3/$1')

      $scope.event.campaign_id = $scope.event.campaign.id ? $scope.event.campaign.id : 0
      Event.update(credentials, actions, $scope.event)
    }

    PermissionsHandler.handlePermissions(['events_edit']);
    Event.find(credentials, actions)

}

module.controller('EventsEditController'
                  , controller).$inject = [  '$scope'
                                           , '$state'
                                           , '$stateParams'
                                           , '$location'
                                           , 'snapRemote'
                                           , 'UserService'
                                           , 'CompanyService'
                                           , 'UserInterface'
                                           , 'Event'
                                           , 'Campaign'
                                           , 'PermissionsHandler'
                                          ]
