var module = angular.module('brandscopicApp.controllers')
  , controller = function($scope, $state, $location, $stateParams, snapRemote, UserService, CompanyService, UserInterface, Event, EventContact, Contact, Country) {

    if( !UserService.isLogged() ) {
      $state.go('login')
      return
    }
    snapRemote.close()

    $scope.getCountries = function(actions) {
      var
          countries = []
        , credentials = { auth_token: UserService.currentUser.auth_token };
      if (actions === null) {
        actions = { 
          success: function (countries) {
            $scope.countries = countries
          }
        }
      }
      Country.all(credentials, actions)
    }

    $scope.countryHasChanged = function() {
      $scope.contact.country = $scope.selectedCountry.name;
      $scope.getStatesForCountry($scope.selectedCountry.id);
    };

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
      $scope.getStates($scope.selectedCountry.id);
    }

    var
        ui = {title: "Edit contact", hasMenuIcon: false, hasDeleteIcon: true, hasBackIcon: false, hasMagnifierIcon: false, hasAddIcon: false, hasSaveIcon: true, hasEditSurveyIcon: false, hasEditIcon: false, hasCancelIcon: false, hasCloseIcon: false, showEventSubNav: true, hasCustomHomeClass: false, searching: false}
      , credentials = { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token, event_id: $stateParams.eventId }
      , actions = { success: function(event) {
                                    $scope.event = event
                                    $scope.eventId = $stateParams.eventId
                                    $scope.contactId = $stateParams.contactId
                                    $scope.contact = []
                                    $scope.countries = []
                                    $scope.states = []
                                    $scope.selectedCountry = {
                                      id: "",
                                      name: ""
                                    };

                                    // Options for User Interface in home partial
                                    angular.extend(UserInterface, ui)
                                    $scope.UserInterface = UserInterface

                                    var
                                        credentials = { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token, event_id: $stateParams.eventId }
                                      , actions = { success: function (contacts) {
                                                      // workaround to find the needed contact from contacts list
                                                      for(var i = 0, item; item = contacts[i++];) {
                                                        if (item.id == $stateParams.contactId) {
                                                          $scope.contact = item
                                                          break
                                                        }
                                                      }

                                                      // if the contact didn't found, means that is not assigned yet.
                                                      // So, we need to find it in assignable contact list
                                                      if (!$scope.contact.id) {
                                                        var assignableActions = { success: function (assignableContacts) {
                                                                // workaround to find the needed contact from contacts list
                                                                for(var i = 0, item; item = assignableContacts[i++];) {
                                                                  if (item.id == $stateParams.contactId) {
                                                                    $scope.contact = item
                                                                    break
                                                                  }
                                                                }
                                                              }
                                                        }
                                                        EventContact.contacts(credentials, assignableActions)
                                                      }
                                                      if ($scope.contact.id) {
                                                        $scope.getCountries({
                                                          success: function(countries) {
                                                            $scope.countries = countries;
                                                            for(var i = 0, item; item = countries[i++];) {
                                                              if (item.name == $scope.contact.country) {
                                                                $scope.selectedCountry = item
                                                                break
                                                              }
                                                            }
                                                            $scope.getStates($scope.selectedCountry.id)
                                                          }
                                                        });
                                                      }
                                                    }
                                                  }
                                    EventContact.all(credentials, actions)
                    }
       }

    Event.find(credentials, actions)

    $scope.updateContact = function() {
      var
          credentials = { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token, contact_id: $stateParams.contactId }
        , actions = { success: function (contact) {
                            $scope.contact = contact
                            $location.path("/home/events/" + $scope.event.id + "/people")
                      }
                    , error: function (contact_error) {
                        $scope.contact_error = contact_error
                      }
                    }
      Contact.update(credentials, actions, $scope.contact)
    }
}

module.controller('EventsPeopleContactsEditController'
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
                                              , 'Country'
                                             ]

