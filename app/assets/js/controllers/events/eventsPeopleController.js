function EventsPeopleController($scope, $state, $stateParams, snapRemote, UserService, CompanyService, UserInterface, Event, EventsRestClient, EventContact, EventTeam) {
    if( !UserService.isLogged() ) {
      $state.go('login');
      return;
    }
    snapRemote.close()

    $scope.gotToState = function(newState) {
      $state.go(newState);
      return;
    };

    $scope.deleteTeam = function(teamId, teamType) {
      var
          credentials = { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token, event_id: $stateParams.eventId, memberable_id: teamId, memberable_type: teamType }
        , actions = { success: function (contact) {
                        // workaround for remove the non 'Active' events
                        for(var i = 0, item; item = $scope.eventTeamItems[i++];) {
                          if (item.id == teamId) {
                            $scope.eventTeamItems.splice(i - 1, 1)
                          }
                        }

                        // $location.path("/home/events/" + $scope.event.id + "/people/team/add")
                      }
                    , error: function (team_error) {
                        $scope.team_error = team_error
                         console.log(team_error)
                      }
                    }

      EventTeam.delete(credentials, actions, $scope.event)
    }

    $scope.deleteContact = function(contactId, contactType) {
      var
          credentials = { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token, event_id: $stateParams.eventId, contactable_id: contactId, contactable_type: contactType }
        , actions = { success: function (contact) {
                        // remove the assigned contact from assignable contacts list
                        for(var i = 0, item; item = $scope.eventContactItems[i++];) {
                          if (item.id == contactId) {
                            $scope.eventContactItems.splice(i-1, 1)
                          }
                        }

                        // $location.path("/home/events/" + $scope.event.id + "/people/contacts/add")
                      }
                    , error: function (event_error) {
                        $scope.event_error = event_error
                         console.log(event_error)
                      }
                    }
      EventContact.delete(credentials, actions, $scope.event)
    }


    var
        ui = {hasMenuIcon: false, hasDeleteIcon: false, hasBackIcon: true, hasMagnifierIcon: false, hasAddIcon: true, hasEditIcon: false, hasSaveIcon: false, hasEditSurveyIcon: false, hasCancelIcon: false, hasCloseIcon: false, showEventSubNav: true, hasCustomHomeClass: false, searching: false, eventSubNav: "people", hasAddPhoto: false}
      , eventTeamData = []
      , authToken = UserService.currentUser.auth_token
      , companyId = CompanyService.getCompanyId()
      , eventId = $stateParams.eventId
      , eventTeam = new EventsRestClient.getEventMembersById(authToken, companyId, eventId)
      , promiseTeam = eventTeam.getEventMembersById().$promise
      , eventContactsData = []
      , eventContacts = new EventsRestClient.getEventContactsById(authToken, companyId, eventId)
      , promiseContacts = eventContacts.getEventContactsById().$promise

      , credentials = { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token, event_id: $stateParams.eventId }
      , actions = { success: function(event) {
                                    $scope.event = event

                                    // Options for User Interface in home partial
                                    ui.title = event.campaign ? event.campaign.name : "People"
                                    angular.extend(UserInterface, ui)
                                    $scope.eventId = $stateParams.eventId
                                    $scope.UserInterface = UserInterface

                                    // $scope.showPeople = "team"
                                    // $scope.UserInterface.AddIconState = "home.events.details.people.team.add";
                                    $scope.showPeople = "contacts"
                                    $scope.UserInterface.AddIconState = "home.events.details.people.contacts.add";
                                    $scope.showPeopleType = function(type) {
                                      $scope.showPeople = type
                                      if ($scope.showPeople =="team")
                                        $scope.UserInterface.AddIconState = "home.events.details.people.team.add"
                                      if ($scope.showPeople =="contacts")
                                        $scope.UserInterface.AddIconState = "home.events.details.people.contacts.add"
                                    }

                                    // get event Team members
                                    promiseTeam.then(function(responseTeam) {
                                     if (responseTeam.status == 200) {
                                      if (responseTeam.data != null) {
                                          eventTeamData = responseTeam.data
                                          $scope.eventTeamItems = eventTeamData
                                      }
                                     } else {
                                        $scope.eventTeamItems = {}
                                     }
                                    })
                                    promiseTeam.catch(function(responseTeam) {
                                      $scope.eventTeamItems = {}
                                    })

                                    // get event Contact members
                                    promiseContacts.then(function(responseContacts) {
                                     if (responseContacts.status == 200) {
                                      if (responseContacts.data != null) {
                                          eventContactsData = responseContacts.data
                                          $scope.eventContactItems = eventContactsData
                                      }
                                     } else {
                                        $scope.eventContactItems = {}
                                     }
                                    })
                                    promiseTeam.catch(function(responseTeam) {
                                      $scope.eventContactItems = {}
                                    })
                             }
        }

   Event.find(credentials, actions)
}

EventsPeopleController.$inject = [  '$scope'
                                  , '$state'
                                  , '$stateParams'
                                  , 'snapRemote'
                                  , 'UserService'
                                  , 'CompanyService'
                                  , 'UserInterface'
                                  , 'Event'
                                  , 'EventsRestClient'
                                  , 'EventContact'
                                  , 'EventTeam'
                                 ]
