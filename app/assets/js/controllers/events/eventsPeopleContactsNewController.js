function EventsPeopleContactsNewController($scope, $state, $location, $stateParams, $timeout, snapRemote, UserService, CompanyService, UserInterface, Event, Contact, Country, EventContact) {
    if( !UserService.isLogged() ) {
      $state.go('login')
      return
    }
    snapRemote.close()

    $scope.contact = {}
    $scope.contact_error = undefined
    $scope.countries = []
    $scope.states = []
    $scope.countryCode = "US"

    $scope.getCountries = function() {
      var
          countries = []
        , credentials = { auth_token: UserService.currentUser.auth_token }
        , actions = { success: function (countries) {
                        $scope.countries = countries
                      }
                    }
      Country.all(credentials, actions)
    }

    $scope.getStates = function(countryId) {
      var
          states = []
        , credentials = { auth_token: UserService.currentUser.auth_token, country_id: countryId }
        , actions = { success: function (states) {
                        $scope.states = states
                      }
                    }
      Country.states(credentials, actions)
    }

    $scope.getStatesForCountry = function() {
      var
          countryCode = $scope.contact.country
      $scope.getStates(countryCode)
    }

    $scope.getCountries()

    var
        ui = {title: "Contact", hasMenuIcon: false, hasDeleteIcon: true, hasBackIcon: false, hasMagnifierIcon: false, hasAddIcon: false, hasSaveIcon: true, hasEditSurveyIcon: false, hasEditIcon: false, hasCancelIcon: false, hasCloseIcon: false, showEventSubNav: false, hasCustomHomeClass: false, searching: false}
      , credentials = { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token, event_id: $stateParams.eventId }

    angular.extend(UserInterface, ui)
    $scope.UserInterface = UserInterface

    $scope.createContact = function(contact) {
      var
          foundContact = {}
        , credentials = { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token }
        , actions = { success: function (contact) {
                            $scope.contact = contact
                            var
                                credentials = { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token, event_id: $stateParams.eventId, term: contact.full_name }
                              , options = { force: true }
                              , actions = { success: function(assignableContacts) {
                                                        // setup foundContact with recently created contact
                                                        // assuming type 'contact'.
                                                        foundContact = contact
                                                        foundContact.type = "contact"
                                                        for(var i = 0, item; item = assignableContacts[i++];) {
                                                          if (contact.id == item.id) {
                                                            foundContact = item
                                                            break
                                                          }
                                                        }

                                                        var
                                                            credentials = { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token, event_id: $stateParams.eventId, contactable_id: foundContact.id, contactable_type: foundContact.type }
                                                          , actions = { success: function (contact) {
                                                                          // remove the assigned contact from assignable contacts list

                                                                          $location.path("/home/events/" + $scope.event.id + "/people")
                                                                        }
                                                                      , error: function (event_error) {
                                                                          $scope.event_error = event_error
                                                                           console.log(event_error)
                                                                        }
                                                                      }
                                                        EventContact.create(credentials, actions, $scope.event)
                                                     }
                              }
                            // we need to wait a little time in order to allow assignable contacts method to fetch new contact
                            $timeout(EventContact.contacts(credentials, actions, options), 3000)
                      }
                    , error: function (contact_error) {
                        $scope.contact_error = contact_error
                      }
                    }
      Contact.create(credentials, actions, $scope.contact)
    }
}
EventsPeopleContactsNewController.$inject = [  '$scope'
                                             , '$state'
                                             , '$location'
                                             , '$stateParams'
                                             , '$timeout'
                                             , 'snapRemote'
                                             , 'UserService'
                                             , 'CompanyService'
                                             , 'UserInterface'
                                             , 'Event'
                                             , 'Contact'
                                             , 'Country'
                                             , 'EventContact'
                                            ]

