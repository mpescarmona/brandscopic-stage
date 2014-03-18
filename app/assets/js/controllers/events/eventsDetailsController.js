function EventsDetailsController($scope, $state, $stateParams, snapRemote, UserService, CompanyService, UserInterface, Event) {
  if( !UserService.isLogged() ) {
    $state.go('login')
    return
  }
  snapRemote.close()

  var
      ui = {hasMenuIcon: false, hasDeleteIcon: false, hasBackIcon: true, hasMagnifierIcon: false, hasAddIcon: true, hasAddPhoto: false, hasSaveIcon: false, hasEditSurveyIcon: false, hasCancelIcon: false, hasCloseIcon: false, showEventSubNav: true, hasCustomHomeClass: false, searching: false}
    , credentials = { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token, event_id: $stateParams.eventId }
    , actions = { success: function(event) {
                                  $scope.event = event

                                  // Options for User Interface in home partial
                                  ui.title = event.campaign ? event.campaign.name : "Event"
                                  angular.extend(UserInterface, ui)
                                  angular.extend(UserInterface, Event.getAllowedActions())
                                  $scope.eventId = $stateParams.eventId
                                  $scope.UserInterface = UserInterface

                  }
      }

 Event.find(credentials, actions)
}

EventsDetailsController.$inject = [  '$scope'
                                   , '$state'
                                   , '$stateParams'
                                   , 'snapRemote'
                                   , 'UserService'
                                   , 'CompanyService'
                                   , 'UserInterface'
                                   , 'Event'
                                  ]

