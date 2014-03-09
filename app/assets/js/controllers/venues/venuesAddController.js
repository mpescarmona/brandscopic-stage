function VenuesAddController($scope, $state, $location, snapRemote, CompanyService, UserService, UserInterface, Venue, Country) {
  if( !UserService.isLogged() ) {
    $state.go('login')
    return
  }
  snapRemote.close()

  var
      ui = { title: 'Venue', hasMenuIcon: false, hasDeleteIcon: true, hasBackIcon: false, hasMagnifierIcon: false, hasAddIcon: false, hasSaveIcon: true, hasCancelIcon: false, hasCloseIcon: false, hasCustomHomeClass: false, searching: false}
  // Options for User Interface in home partial
  angular.extend(UserInterface, ui)
  $scope.UserInterface = UserInterface

  $scope.countries = []
  $scope.states = []
  $scope.countryCode = "US"
  $scope.venue = {}
  $scope.venue_error = undefined

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
        countryCode = $scope.venue.country
    $scope.getStates(countryCode)
  }

  $scope.getVenueTypes = function() {
    var
        credentials = { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token }
      , actions = { success: function(venueTypes) {
                                    $scope.venueTypes = venueTypes
                             }
        }
    Venue.types(credentials, actions)
  }

  $scope.createVenue = function(venue) {
    var
        credentials = { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token }
      , actions = { success: function (venue) {
                          $scope.venue = venue
                          $location.path("/home/venues/" + venue.id + "/about")
                    }
                  , error: function (venue_error) {
                      $scope.venue_error = venue_error
                    }
                  }
    Venue.create(credentials, actions, $scope.venue)
  }

  $scope.getCountries()
  $scope.getVenueTypes()

}

VenuesAddController.$inject = [  '$scope'
                               , '$state'
                               , '$location'
                               , 'snapRemote'
                               , 'CompanyService'
                               , 'UserService'
                               , 'UserInterface'
                               , 'Venue'
                               , 'Country'
                              ]
