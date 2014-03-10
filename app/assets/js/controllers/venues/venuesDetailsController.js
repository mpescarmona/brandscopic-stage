function VenuesDetailsController($scope, $state, $stateParams, snapRemote, CompanyService, UserService, UserInterface, Venue) {
    if( !UserService.isLogged() ) {
      $state.go('login')
      return
    }
    snapRemote.close()

    var
        ui = {title: 'Venues', hasMenuIcon: false, hasDeleteIcon: false, hasBackIcon: true, hasMagnifierIcon: false, hasAddIcon: false, hasSaveIcon: false, hasEditSurveyIcon: false, hasCancelIcon: false, hasCloseIcon: false, showVenueSubNav: true, hasCustomHomeClass: false, searching: false}
      , credentials = { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token, venue_id: $stateParams.venueId }
      , actions = { success: function(venue) {
                                ui.title =  venue.name
                                $scope.venue = venue
                                angular.extend(UserInterface, ui)
                                $scope.UserInterface = UserInterface
                              }
        }
    Venue.find(credentials, actions)
}

VenuesDetailsController.$inject = [  '$scope'
                                   , '$state'
                                   , '$stateParams'
                                   , 'snapRemote'
                                   , 'CompanyService'
                                   , 'UserService'
                                   , 'UserInterface'
                                   , 'Venue'
                                  ]
