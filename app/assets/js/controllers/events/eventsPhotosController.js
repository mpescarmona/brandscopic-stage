function eventsPhotosCtrl($scope, $state, $stateParams, snapRemote, UserService, CompanyService, UserInterface, Event) {
    if( !UserService.isLogged() ) {
      $state.go('login');
      return;
    }
    snapRemote.close()

    var
        ui = {hasMenuIcon: false, hasDeleteIcon: false, hasBackIcon: true, hasMagnifierIcon: false, hasAddIcon: true, hasSaveIcon: false, hasCancelIcon: false, hasCloseIcon: false, showEventSubNav: true, hasCustomHomeClass: false, searching: false, eventSubNav: "photos"}
      , credentials = { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token, event_id: $stateParams.eventId }
      , actions = { success: function(event){
                                    $scope.event = event;

                                    // Options for User Interface in home partial
                                    ui.title = event.campaign ? event.campaign.name : "Photos"
                                    angular.extend(UserInterface, ui)
                                    $scope.UserInterface = UserInterface;
                                    $scope.eventId = $stateParams.eventId;
                              }
       }

    Event.find(credentials, actions)
}

eventsPhotosCtrl.$inject = [
    "$scope",
    "$state",
    "$stateParams",
  	"snapRemote",
  	"UserService",
  	"CompanyService",
  	"UserInterface",
  	"Event"
];