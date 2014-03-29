var module = angular.module('brandscopicApp.controllers')
  , controller = function($scope, $state, $stateParams, snapRemote, UserService, CompanyService, UserInterface, Event, PermissionsHandler) {

  if( !UserService.isLogged() ) {
    $state.go('login')
    return
  }
  snapRemote.close()

  // Options for User Interface in home partial
  $scope.UserInterface = UserInterface
  $scope.showEvents = false
  var
      ui = {title: 'Events',hasMenuIcon: true, hasDeleteIcon: false, hasBackIcon: false, hasMagnifierIcon: true, hasAddIcon: UserService.permissionIsValid('events_create'), hasSaveIcon: false, hasCancelIcon: false, hasCloseIcon: false, showEventSubNav: true, hasCustomHomeClass: false, searching: false, AddIconState: "home.events.add",hasAddPhoto: false}
    , today = (new Date().getMonth() + 1) + "/" + new Date().getDate() + "/" + new Date().getFullYear()
    , future = "12/31/" + (new Date().getFullYear() + 10)
    , credentials = { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token, start_date: today, end_date: future, 'status[]': 'Active', page: 1 }
    , options = { force: true }
    , isLoadingEvents = true //initially set to true so we don't start loading events by infinite scrolling when the page is loaded
    , actions = { success: function(events, filters, page) {
                              // workaround for remove the non 'Active' and 'past' events
                              var
                                  evt = []
                              isLoadingEvents = false;
                              for (var i = 0, len = events.length; i < len; i++) {
                                if (events[i].status == 'Active')
                                  evt.push(events[i])
                              }
                              $scope.eventsItems = evt
                              $scope.filters = filters
                              if($scope.eventsItems.length) {
                                $scope.showEvents = true
                              }
                              $scope.page = page != null ? page : 0;
                              angular.extend(UserInterface, ui)
                              if ($stateParams.filter) {
                                var filter = $stateParams.filter
                                  , capitalizedFilterName = filter.charAt(0).toUpperCase() + filter.slice(1)
                                $scope.filterStatus(capitalizedFilterName)
                              }
                            },
                  error: function() {
                    isLoadingEvents = false;
                  }
      }
  isLoadingEvents = true;
  $scope.$on('ALL_EVENT', function (event, param) {
    if(!param) {
      try {
        isLoadingEvents = true;
        Event.all(credentials, actions, options)
      } catch (error) {
        isLoadingEvents = false;
        throw error;
      }
    }
  })

  $scope.event_status = false
  $scope.filterStatus = function(status, shouldCleanList) {
    $scope.event_status = status;
    if (shouldCleanList) {
      $scope.page = 1;
    }

    var
        today = (new Date().getMonth() + 1) + "/" + new Date().getDate() + "/" + new Date().getFullYear()
      , future = "12/31/" + (new Date().getFullYear() + 10)
      , credentials = ($scope.event_status) ? { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token, page: $scope.page, 'status[]': 'Active', 'event_status[]': status }
                                            : { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token, page: $scope.page, 'status[]': 'Active' } 
      , options = { force: true }
      , actions = { success: function(events, filters, page) {
                                isLoadingEvents = false;
                                if (shouldCleanList) {
                                  $scope.eventsItems = [];
                                }
                                angular.forEach(events, function(value, index) {
                                  $scope.eventsItems.push(value);
                                });
                                $scope.filters = filters
                                $scope.page = page != null ? page : 1;
                                angular.extend(UserInterface, ui)
                              },
                    error: function() {
                      isLoadingEvents = false;
                    }
        }
    isLoadingEvents = true;
    try {
      Event.all(credentials, actions, options);
    } catch(error) {
      isLoadingEvents = false;
      throw error;
    }
  }

  $scope.nextPage = function() {
    console.log('Loading next page');
    $scope.page = Number($scope.page) + 1
    $scope.filterStatus($scope.event_status)
  }

  $scope.deleteEvent = function(deletedEvent) {
    var
        credentials = { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token, event_id: deletedEvent.id }
      , actions = { success: function (event) {
                          $scope.event = event
                          // workaround for remove the non removed event from event list
                          var
                              evt = []
                          for (var i = 0, len = $scope.eventsItems.length; i < len; i++) {
                            if ($scope.eventsItems[i].status == 'Active' && $scope.eventsItems[i].id != event.id) {
                              evt.push($scope.eventsItems[i])
                            }
                          }
                          $scope.eventsItems = evt
                          $state.go('home.events')
                    }
                  , error: function (event_error) {
                      $scope.event_error = event_error
                       console.log(event_error)
                    }
                  }

    deletedEvent.active = false
    Event.update(credentials, actions, deletedEvent)
  }
  $scope.filter = "";
  
  $scope.isLoadingEvents = function() {
    console.log('Loading events: ' + isLoadingEvents);
    return isLoadingEvents;
  };

  $scope.getObservableProperties = function() {
    return ['eventsItems'];
  }

  // Set typeahead to search by events
  $scope.$emit("SEARCH_DIRECTIVE", "events")

  $scope.$on("RESULT_SEARCH", function (event, filter) {
      $scope.filter = filter
      $scope.$apply()
  })

  PermissionsHandler.handlePermissions(['events']);
  Event.all(credentials, actions, options)
}

module.controller('eventsCtrl'
                  , controller).$inject = [  '$scope'
                                           , '$state'
                                           , '$stateParams'
                                           , 'snapRemote'
                                           , 'UserService'
                                           , 'CompanyService'
                                           , 'UserInterface'
                                           , 'Event'
                                           , 'PermissionsHandler'
                                          ]
