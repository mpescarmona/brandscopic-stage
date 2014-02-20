function eventsCtrl($scope, $state, $stateParams, snapRemote, UserService, CompanyService, UserInterface, Event) {
  if( !UserService.isLogged() ) {
    $state.go('login');
    return;
  }
  snapRemote.close()

  // Options for User Interface in home partial
  $scope.UserInterface = UserInterface;
  var
      ui = {title: 'Events',hasMenuIcon: true, hasDeleteIcon: false, hasBackIcon: false, hasMagnifierIcon: true, hasAddIcon: true, hasSaveIcon: false, hasCancelIcon: false, hasCloseIcon: false, showEventSubNav: true, hasCustomHomeClass: false, searching: false, AddIconState: "home.events.add",hasAddPhoto: false}
    , today = (new Date().getMonth() + 1) + "/" + new Date().getDate() + "/" + new Date().getFullYear()
    , future = "12/31/" + (new Date().getFullYear() + 10)
    , credentials = { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token, start_date: today, end_date: future, 'status[]': 'Active' }
    , options = { force: true }
    , actions = { success: function(events, filters) {
                              // workaround for remove the non 'Active' and 'past' events
                              var
                                  evt = []
                                , today = new Date()
                                , startDate = null
                                , endDate = null
                              for (var i = 0, len = events.length; i < len; i++) {
                                startDate = new Date(events[i].start_date)
                                endDate = new Date(events[i].end_date)
                                if (events[i].status == 'Active' && (startDate >= today || endDate >= today)) {
                                // if (events[i].status == 'Active') {
                                  evt.push(events[i])
                                }
                              }
                              $scope.eventsItems = evt
                              $scope.filters = filters
                              $scope.page = events.page
                              angular.extend(UserInterface, ui)
                            }
      }

  Event.all(credentials, actions, options)

  $scope.event_status = false
  $scope.filterStatus = function(status) {
    $scope.event_status = ($scope.event_status == status) ? false : status;

    var
        today = (new Date().getMonth() + 1) + "/" + new Date().getDate() + "/" + new Date().getFullYear()
      , future = "12/31/" + (new Date().getFullYear() + 10)
      , credentials = ($scope.event_status) ? { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token, page: $scope.page, 'status[]': 'Active', 'event_status[]': status } 
                                            : { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token, start_date: today, end_date: future, page: $scope.page, 'status[]': 'Active' }
      , options = { force: true }
      , actions = { success: function(events, filters) {
                                $scope.eventsItems = events
                                $scope.filters = filters
                                $scope.page = events.page
                                angular.extend(UserInterface, ui)
                              }
        }

    Event.all(credentials, actions, options)
  }

  $scope.nextPage = function() {
    $scope.page = $scope.page + 1
    filterStatus($scope.event_status)
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
  $scope.filter = "";
  $scope.$on("FILTER_EVENTS", function (event, filter) {
      $scope.filter = filter;
      $scope.$apply();
  });

}

eventsCtrl.$inject = [
  '$scope',
  '$state',
  '$stateParams',
  'snapRemote',
  'UserService',
  'CompanyService',
  'UserInterface',
  'Event'
];
