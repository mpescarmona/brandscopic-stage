var module = angular.module('brandscopicApp.controllers')
  , controller = function($scope, $state, $location, $stateParams, snapRemote, UserService, CompanyService, UserInterface, Event, EventContact, Contact) {

    if( !UserService.isLogged() ) {
      $state.go('login')
      return
    }
    snapRemote.close()

    var
        ui = {title: "Contacts", hasMenuIcon: false, hasDeleteIcon: true, hasBackIcon: false, hasMagnifierIcon: false, hasAddIcon: true, hasEditIcon: false, hasSaveIcon: false, hasEditSurveyIcon: false, hasCancelIcon: false, hasCloseIcon: false, showEventSubNav: false, hasCustomHomeClass: false, searching: false, eventSubNav: "people", AddIconState: "home.events.details.people.contacts.new"}
      , credentials = { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token, event_id: $stateParams.eventId }
      , actions = { success: function(event) {
                                    $scope.event = event
                                    $scope.eventId = $stateParams.eventId

                                    // Options for User Interface in home partial
                                    angular.extend(UserInterface, ui)
                                    $scope.UserInterface = UserInterface

                                    var
                                        credentials = { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token, event_id: $stateParams.eventId }
                                      , options = { force: true }
                                      , actions = { success: function(contacts) {
                                                                  var contactList = []
                                                                  for(var i = 0, item; item = contacts[i++];) {
                                                                    if (item.type == 'contact') {
                                                                      var
                                                                          credentialsContact = { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token, contact_id: item.id }
                                                                        , actionsContact = { success: function (contactFound) {
                                                                                                if(contactFound && contactFound.last_name && contactFound.last_name != '' && contactFound.country && contactFound.country != '' && contactFound.state && contactFound.state != '' && contactFound.city && contactFound.city != '') {
                                                                                                  contactList.push({id: contactFound.id, full_name: contactFound.full_name, title: contactFound.title, type: 'contact'} )
                                                                                                }
                                                                                             }
                                                                                           }
                                                                      Contact.find(credentialsContact, actionsContact)

                                                                    }
                                                                    else
                                                                      contactList.push(item)
                                                                  }

                                                                  $scope.contacts = contactList
                                                                  // Options for User Interface in home partial
                                                                  angular.extend(UserInterface, ui)
                                                                  $scope.UserInterface = UserInterface
                                                                  $scope.eventId = $stateParams.eventId

                                                                  $scope.assignContact = function(contactId, contactType) {
                                                                    var
                                                                        credentials = { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token, event_id: $stateParams.eventId, contactable_id: contactId, contactable_type: contactType }
                                                                      , actions = { success: function (contact) {
                                                                                      // remove the assigned contact from assignable contacts list
                                                                                      for(var i = 0, item; item = $scope.contacts[i++];) {
                                                                                        if (item.id == contactId) {
                                                                                          $scope.contacts.splice(i-1, 1)
                                                                                        }
                                                                                      }
                                                                                      $location.path("/home/events/" + $scope.event.id + "/people/contacts/add")
                                                                                    }
                                                                                  , error: function (event_error) {
                                                                                      $scope.event_error = event_error
                                                                                       console.log(event_error)
                                                                                    }
                                                                                  }
                                                                    EventContact.create(credentials, actions, $scope.event)
                                                                  }
                                                             }
                                      }
                                    EventContact.contacts(credentials, actions, options)
                    }
        }

   Event.find(credentials, actions)
}

module.controller('EventsPeopleContactsAddController'
                  , controller).$inject = [  '$scope'
                                            , '$state'
                                            , '$location'
                                            , '$stateParams'
                                            , 'snapRemote'
                                            , 'UserService'
                                            , 'CompanyService'
                                            , 'UserInterface'
                                            , 'Event'
                                            , 'EventContact'
                                            , 'Contact'
                                           ]
