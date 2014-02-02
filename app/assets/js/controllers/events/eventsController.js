function eventsCtrl($scope, $state, snapRemote, UserService, CompanyService, UserInterface, Event) {
  if( !UserService.isLogged() ) {
    $state.go('login');
    return;
  }
  snapRemote.close()

  // Options for User Interface in home partial
  $scope.UserInterface = UserInterface;
  var
      ui = {title: 'Events',hasMenuIcon: true, hasDeleteIcon: false, hasBackIcon: false, hasMagnifierIcon: true, hasAddIcon: true, hasSaveIcon: false, hasCancelIcon: false, hasCloseIcon: false, showEventSubNav: true, hasCustomHomeClass: false, searching: false, AddIconState: "home.events.add"}
    , credentials = { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token }
    , actions = { success: function(events, filters){
                              // workaround for remove the non 'Active' events
                              for(var i = 0, evt; evt = events[i++];) {
                                if (evt.status != 'Active') {
                                  events.splice(i-1, 1)
                                }
                              }
                              $scope.eventsItems = events
                              $scope.filters = filters
                              angular.extend(UserInterface, ui)
                            }
      }

  Event.all(credentials, actions)

  $scope.event_status = false;
  $scope.filterStatus = function(status) {
    $scope.event_status = ($scope.event_status == status) ? false : status;
  }

  $scope.deleteEvent = function() {
    var
        credentials = { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token, event_id: $stateParams.eventId }
      , actions = { success: function (event) {
                          $scope.event = event
                          // $location.path("/home/events/" + event.id + "/about")
                    }
                  , error: function (event_error) {
                      $scope.event_error = event_error
                       console.log(event_error)
                    }
                  }

    $scope.event.active = false
    Event.update(credentials, actions, $scope.event)
  }
}

eventsCtrl.$inject = [
  '$scope', 
  '$state', 
  'snapRemote', 
  'UserService', 
  'CompanyService',
  'UserInterface',
  'Event'
];
