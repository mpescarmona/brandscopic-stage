function EventsPeopleContactsController($scope, $state, $stateParams, snapRemote, UserService, CompanyService, UserInterface, Event, EventContact) {
    if( !UserService.isLogged() ) {
      $state.go('login')
      return
    }
    snapRemote.close()
    $scope.goBack = function(){
      $state.go('home.events')
      return
    }
    var
        ui = {title: 'Contact info', hasMenuIcon: false, hasDeleteIcon: false, hasBackIcon: true, hasMagnifierIcon: false, hasAddIcon: false, hasAddPhoto: false, hasEditIcon: false, hasSaveIcon: false, hasEditSurveyIcon: false, hasCancelIcon: false, hasCloseIcon: false, showEventSubNav: true, hasCustomHomeClass: false, searching: false, eventSubNav: "people"}
      , credentials = { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token, event_id: $stateParams.eventId }
      , actions = { success: function(event) {
                                    $scope.event = event

                                    // Options for User Interface in home partial
                                    angular.extend(UserInterface, ui)
                                    $scope.eventId = $stateParams.eventId
                                    $scope.contactId = $stateParams.contactId
                                    $scope.UserInterface = UserInterface
                                    $scope.contact = []

                                    var
                                        credentials = { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token, event_id: $stateParams.eventId }
                                      , options = { force: true }
                                      , actions = { success: function (contacts) {
                                                      // workaround to find the needed contact from contacts list
                                                      for(var i = 0, item; item = contacts[i++];) {
                                                        if (item.id == $stateParams.contactId) {
                                                          $scope.contact = item

                                                          ui.hasEditIcon = ((item.type == 'contact') ? true : false)
                                                          angular.extend(UserInterface, ui)
                                                          angular.extend($scope.UserInterface, ui)
                                                          break
                                                        }
                                                      }

                                                      // if the contact didn't found, means that is not assigned yet.
                                                      // So, we need to find it in assignable contact list
                                                      if ($scope.contact.length == 0) {
                                                        var assignableCredentials = { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token, event_id: $stateParams.eventId }
                                                          , options = { force: true }
                                                          , assignableActions = { success: function (assignableContacts) {
                                                                // workaround to find the needed contact from contacts list
                                                                for(var i = 0, item; item = assignableContacts[i++];) {
                                                                  if (item.id == $stateParams.contactId) {
                                                                    $scope.contact = item

                                                                    ui.hasEditIcon = false
                                                                    angular.extend(UserInterface, ui)
                                                                    angular.extend($scope.UserInterface, ui)
                                                                    break
                                                                  }
                                                                }
                                                              }
                                                        }
                                                        EventContact.contacts(assignableCredentials, assignableActions, options)
                                                      }
                                                    }
                                                  }
                                    EventContact.all(credentials, actions, options)

                                    $scope.UserInterface.EditIconUrl = "#/home/events/" + $scope.event.id + "/people/contacts/" + $stateParams.contactId + "/edit"
                    }
       }

   Event.find(credentials, actions)
  }

EventsPeopleContactsController.$inject = [  '$scope'
                                          , '$state'
                                          , '$stateParams'
                                          , 'snapRemote'
                                          , 'UserService'
                                          , 'CompanyService'
                                          , 'UserInterface'
                                          , 'Event'
                                          , 'EventContact'
                                         ]
