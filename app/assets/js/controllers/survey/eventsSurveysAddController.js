function eventsSurveysAddController($scope, $state, $stateParams, snapRemote, UserService, UserInterface, Event) {
    if( !UserService.isLogged() ) {
      $state.go('login');
      return;
    }
    snapRemote.close()

    var
        ui = {title: "Survey", hasMenuIcon: false, hasDeleteIcon: true, hasBackIcon: false, hasMagnifierIcon: false, hasAddIcon: false, hasSaveIcon: true, hasCancelIcon: false, hasCloseIcon: false, showEventSubNav: true, searching: false, eventSubNav: "expenses", AddIconState: ""}
      , credentials = { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token, event_id: $stateParams.eventId }
      , actions = { success: function(event){
                                    $scope.event = event;

                                    // Options for User Interface in home partial
                                    angular.extend(UserInterface, ui)
                                    $scope.UserInterface = UserInterface;
                                    $scope.eventId = $stateParams.eventId;
                              }
       }

    Event.find(credentials, actions)
}

eventsSurveysAddController.$inject = [
  '$scope', 
  '$state', 
  '$stateParams', 
  'snapRemote', 
  'UserService', 
  'UserInterface', 
  'Event'
];
