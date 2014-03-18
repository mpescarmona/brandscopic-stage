function EventsPeopleTeamAddController($scope, $state, $location, $stateParams, snapRemote, UserService, CompanyService, UserInterface, Event, EventTeam) {
  if( !UserService.isLogged() ) {
    $state.go('login')
    return
  }
  snapRemote.close()

  var
      ui = {title: "Event team", hasMenuIcon: false, hasDeleteIcon: true, hasBackIcon: false, hasMagnifierIcon: false, hasAddIcon: false, hasEditIcon: false, hasSaveIcon: false, hasEditSurveyIcon: false, hasCancelIcon: false, hasCloseIcon: false, showEventSubNav: false, hasCustomHomeClass: false, searching: false, eventSubNav: "people"}
    , credentials = { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token, event_id: $stateParams.eventId }
    , actions = { success: function(event) {
                                  $scope.event = event
                                  $scope.eventId = $stateParams.eventId

                                  // Options for User Interface in home partial
                                  angular.extend(UserInterface, ui)
                                  $scope.UserInterface = UserInterface

                                  var
                                      credentials = { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token, event_id: $stateParams.eventId }
                                    , actions = { success: function(teams) {
                                                                $scope.teams = teams

                                                                $scope.assignTeam = function(teamId, teamType) {
                                                                  var
                                                                      credentials = { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token, event_id: $stateParams.eventId, memberable_id: teamId, memberable_type: teamType }
                                                                    , actions = { success: function (contact) {
                                                                                    // workaround for remove the non 'Active' events
                                                                                    for(var i = 0, item; item = $scope.teams[i++];) {
                                                                                      if (item.id == teamId) {
                                                                                        $scope.teams.splice(i-1, 1)
                                                                                      }
                                                                                    }

                                                                                    $location.path("/home/events/" + $scope.event.id + "/people/team/add")
                                                                                  }
                                                                                , error: function (team_error) {
                                                                                    $scope.team_error = team_error
                                                                                     console.log(team_error)
                                                                                  }
                                                                                }

                                                                  EventTeam.create(credentials, actions, $scope.event)
                                                                }
                                                           }
                                    }
                                  EventTeam.members(credentials, actions)
                  }
      }

  Event.find(credentials, actions)
}

EventsPeopleTeamAddController.$inject = [  '$scope'
                                         , '$state'
                                         , '$location'
                                         , '$stateParams'
                                         , 'snapRemote'
                                         , 'UserService'
                                         , 'CompanyService'
                                         , 'UserInterface'
                                         , 'Event'
                                         , 'EventTeam'
                                        ]
