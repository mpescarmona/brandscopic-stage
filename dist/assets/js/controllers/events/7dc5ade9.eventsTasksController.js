var module = angular.module('brandscopicApp.controllers')
  , controller1 = function($scope, $state, $stateParams, snapRemote, UserService, CompanyService, UserInterface, Event) {

  if( !UserService.isLogged() ) {
    $state.go('login')
    return
  }
  snapRemote.close()

  var
      ui = {hasMenuIcon: false, hasDeleteIcon: false, hasBackIcon: true, hasMagnifierIcon: false, hasAddIcon: false, hasAddPhoto: false, hasSaveIcon: false, hasEditSurveyIcon: false, hasCancelIcon: false, hasCloseIcon: false, showEventSubNav: true, hasCustomHomeClass: false, searching: false, eventSubNav: "tasks"}
    , credentials = { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token, event_id: $stateParams.eventId }
    , actions = { success: function(event){
                                  $scope.event = event

                                  // Options for User Interface in home partial
                                  ui.title = event.campaign ? event.campaign.name : "Tasks"
                                  angular.extend(UserInterface, ui)
                                  $scope.UserInterface = UserInterface
                                  // $scope.editUrl = "#/home/events/" + $stateParams.eventId + "/edit"


                                  $scope.eventId = $stateParams.eventId
                                  $scope.eventTaskItems = [{'id': 1, 'assigned': 'Chris Jaskot', 'Task': 'Pickup t-shirts from storage unit', 'date': '2013-12-13', 'task_status': 'Late'},
                                                           {'id': 2, 'assigned': 'George Tan', 'Task': 'Confirm time and location of event', 'date': '2013-12-13', 'task_status': 'Incomplete'},
                                                           {'id': 3, 'assigned': '', 'Task': 'Hire models for event', 'date': '2013-12-13', 'task_status': 'Unassigned'},
                                                           {'id': 4, 'assigned': 'George Tan', 'Task': 'Identify drink recipes for promotion', 'date': '2013-12-13', 'task_status': 'Late'},
                                                           {'id': 5, 'assigned': 'Chris Jaskot', 'Task': 'Order ballons for the event', 'date': '2013-12-13', 'task_status': 'Late'},
                                                           {'id': 6, 'assigned': 'Chris Jaskot', 'Task': 'Order ballons for the event', 'date': '2013-12-13', 'task_status': 'Incomplete'},
                                                           {'id': 7, 'assigned': '', 'Task': 'Identify catering provider', 'date': '2013-12-13', 'task_status': 'Unassigned'},
                                                           {'id': 8, 'assigned': 'Chris Jaskot', 'Task': 'Select event presenter', 'date': '2013-12-13', 'task_status': 'Incomplete'}]

                                  $scope.eventTaskFilters = [{'label': 'Late',
                                                              'id': 'Late',
                                                              'name': 'task_status',
                                                              'count': 3,
                                                              'selected': false
                                                              },
                                                              {
                                                              'label': 'Unassigned',
                                                              'id': 'Unassigned',
                                                              'name': 'task_status',
                                                              'count': 2,
                                                              'selected': false
                                                              },
                                                              {
                                                              'label': 'Assigned',
                                                              'id': 'Assigned',
                                                              'name': 'task_status',
                                                              'count': 2,
                                                              'selected': false
                                                              },
                                                              {
                                                              'label': 'Incomplete',
                                                              'id': 'Incomplete',
                                                              'name': 'task_status',
                                                              'count': 2,
                                                              'selected': false
                                                              },
                                                              {
                                                              'label': 'Complete',
                                                              'id': 'Complete',
                                                              'name': 'task_status',
                                                              'count': 3,
                                                              'selected': false
                                                              }]

                                  $scope.task_status = false
                                  $scope.filterTask = function(status) {
                                    $scope.task_status = ($scope.task_status == status) ? false : status
                                  }
                                  //$scope.goHere = function (hash) {
                                    //$location.path(hash)
                                  //}
                                  // remember to inject $location

                            }

     }
 Event.find(credentials, actions)
}


, controller2 = function($scope, $state, $stateParams, snapRemote, UserService, CompanyService, UserInterface, Event) {
      if( !UserService.isLogged() ) {
        $state.go('login')
        return
      }
      snapRemote.close()

      var
          ui = {title: "Task details", hasMenuIcon: false, hasDeleteIcon: false, hasBackIcon: true, hasMagnifierIcon: false, hasAddIcon: false, hasSaveIcon: false, hasEditSurveyIcon: false, hasCancelIcon: false, hasCloseIcon: false, showEventSubNav: true, hasCustomHomeClass: false, searching: false, eventSubNav: "tasks"}
        , credentials = { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token, event_id: $stateParams.eventId }
        , actions = { success: function(event){
                                      $scope.event = event

                                      // Options for User Interface in home partial
                                      angular.extend(UserInterface, ui)
                                      $scope.UserInterface = UserInterface
                                      // $scope.editUrl = "#/home/events/" + $stateParams.eventId + "/edit"
                                      $scope.eventId = $stateParams.eventId
                                      $scope.taskId = $stateParams.taskId
                                }

         }

      Event.find(credentials, actions)

    }


, controller3 = function($scope, $state, $stateParams, snapRemote, UserService, CompanyService, UserInterface, Event) {
      if( !UserService.isLogged() ) {
        $state.go('login')
        return
      }
      snapRemote.close()

      var
          ui = {title: "Edit task", hasMenuIcon: false, hasDeleteIcon: true, hasBackIcon: false, hasMagnifierIcon: false, hasAddIcon: false, hasSaveIcon: true, hasEditSurveyIcon: false, hasCancelIcon: false, hasCloseIcon: false, showEventSubNav: true, hasCustomHomeClass: false, searching: false, eventSubNav: "tasks"}
        , credentials = { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token, event_id: $stateParams.eventId }
        , actions = { success: function(event){
                                      $scope.event = event

                                      // Options for User Interface in home partial
                                      angular.extend(UserInterface, ui)
                                      $scope.UserInterface = UserInterface
                                      $scope.eventId = $stateParams.eventId
                                      $scope.taskId = $stateParams.taskId
                                }

         }

      Event.find(credentials, actions)

    }

module.controller('EventsTasksController'
                  , controller1).$inject = [  '$scope'
                                            , '$state'
                                            , '$stateParams'
                                            , 'snapRemote'
                                            , 'UserService'
                                            , 'CompanyService'
                                            , 'UserInterface'
                                            , 'Event'
                                           ]
module.controller('EventsTasksDetailsController'
                  , controller2).$inject = [  '$scope'
                                            , '$state'
                                            , '$stateParams'
                                            , 'snapRemote'
                                            , 'UserService'
                                            , 'CompanyService'
                                            , 'UserInterface'
                                            , 'Event'
                                           ]
module.controller('EventsTasksEditController'
                  , controller3).$inject = [  '$scope'
                                            , '$state'
                                            , '$stateParams'
                                            , 'snapRemote'
                                            , 'UserService'
                                            , 'CompanyService'
                                            , 'UserInterface'
                                            , 'Event'
                                           ]
