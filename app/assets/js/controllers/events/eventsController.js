var module = angular.module('brandscopicApp.controllers')
  , controller = function($scope, $state, $stateParams, snapRemote, UserService, CompanyService, UserInterface, Event) {

  if( !UserService.isLogged() ) {
    $state.go('login')
    return
  }
  snapRemote.close()

  // Options for User Interface in home partial
  $scope.UserInterface = UserInterface
  $scope.showEvents = false
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
                              for (var i = 0, len = events.length; i < len; i++) {
                                if (events[i].status == 'Active')
                                  evt.push(events[i])
                              }
                              $scope.eventsItems = evt
                              $scope.filters = filters
                              if($scope.eventsItems.length) {
                                $scope.showEvents = true
                              }
                              $scope.page = events.page
                              angular.extend(UserInterface, ui)
                              if ($stateParams.filter) {
                                var filter = $stateParams.filter
                                  , capitalizedFilterName = filter.charAt(0).toUpperCase() + filter.slice(1)
                                $scope.filterStatus(capitalizedFilterName)
                              }
                            }
      }

  Event.all(credentials, actions, options)

  $scope.$on('ALL_EVENT', function (event, param) {
    if(!param)
      Event.all(credentials, actions, options)
  })

  $scope.event_status = false
  $scope.filterStatus = function(status) {
    $scope.event_status = ($scope.event_status == status) ? false : status

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
  $scope.filter = ""

  // Set typeahead to search by events
  $scope.$emit("SEARCH_DIRECTIVE", "events")

  $scope.$on("RESULT_SEARCH", function (event, filter) {
      $scope.filter = filter
      $scope.$apply()
  })
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
                                          ]
