function VenuesAnalysisController($scope, $state, $stateParams, snapRemote, CompanyService, UserService, UserInterface, Venue) {
    if( !UserService.isLogged() ) {
      $state.go('login')
      return
    }
    snapRemote.close()

    var
        ui = {}
      , credentials = { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token, venue_id: $stateParams.venueId }
      , actions = { success: function(venue) {
                                ui = {title: venue.name, hasMenuIcon: false, hasDeleteIcon: false, hasBackIcon: true, hasMagnifierIcon: false, hasAddIcon: false, hasSaveIcon: false, hasCancelIcon: false, hasCloseIcon: false, showVenueSubNav: true, hasCustomHomeClass: false, searching: false, venueSubNav: "analysis"}
                                $scope.venue = venue
                                angular.extend(UserInterface, ui)
                                $scope.UserInterface = UserInterface
                              }
        }

    Venue.find(credentials, actions)
}

VenuesAnalysisController.$inject = [  '$scope'
                                    , '$state'
                                    , '$stateParams'
                                    , 'snapRemote'
                                    , 'CompanyService'
                                    , 'UserService'
                                    , 'UserInterface'
                                    , 'Venue'
                                   ]
