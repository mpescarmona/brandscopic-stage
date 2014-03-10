function VenuesController ($scope, $state, snapRemote, UserService, CompanyService, UserInterface, Venue) {
    if( !UserService.isLogged() ) {
      $state.go('login')
      return
    }
    snapRemote.close()

    $scope.showVenues = false
    var
        ui = {title: 'Venues', hasMenuIcon: true, hasDeleteIcon: false, hasBackIcon: false, hasMagnifierIcon: false, hasAddIcon: true, hasSaveIcon: false, hasCancelIcon: false, hasCloseIcon: false, showVenueSubNav: true, hasCustomHomeClass: false, searching: false, AddIconState: "home.venues.add"}
      , credentials = { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token }
      , options = { force: true }
      , actions = { success: function(venues) {
                                $scope.venuesItems = venues
                                if($scope.venuesItems.length) {
                                  $scope.showVenues = true
                                }
                                $scope.page = venues.page
                                angular.extend(UserInterface, ui)
                                $scope.UserInterface = UserInterface
                              }
        }

    Venue.all(credentials, actions, options)
}

VenuesController.$inject = [  '$scope'
                            , '$state'
                            , 'snapRemote'
                            , 'UserService'
                            , 'CompanyService'
                            , 'UserInterface'
                            , 'Venue'
                           ]
