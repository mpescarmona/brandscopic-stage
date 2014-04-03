var module = angular.module('brandscopicApp.controllers')
  , controller = function($scope, $state, $stateParams, snapRemote, CompanyService, UserService, UserInterface, Venue) {

    if( !UserService.isLogged() ) {
      $state.go('login')
      return
    }
    snapRemote.close()
    $scope.hasPhotos = false
    $scope.loading = true

    var
        ui = {}
      , credentials = { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token, venue_id: $stateParams.venueId }
      , actions = { success: function(venue) {
                                ui = {title: venue.name, hasMenuIcon: false, hasDeleteIcon: false, hasBackIcon: true, hasMagnifierIcon: false, hasAddIcon: false, hasSaveIcon: false, hasEditSurveyIcon: false, hasCancelIcon: false, hasCloseIcon: false, showVenueSubNav: true, hasCustomHomeClass: false, searching: false, venueSubNav: "photos"}
                                $scope.venue = venue
                                angular.extend(UserInterface, ui)
                                $scope.UserInterface = UserInterface

                                var
                                    credentials = { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token, venue_id: venue.id }
                                  , actions = { success: function(photos) {
                                                            $scope.loading = false
                                                            if (photos.length)
                                                                  $scope.hasPhotos = true

                                                            $scope.photos = photos
                                              }
                                    }
                                Venue.photos(credentials, actions)
                              }
        }

    Venue.find(credentials, actions)
}

module.controller('VenuesPhotosController'
                  , controller).$inject = [  '$scope'
                                           , '$state'
                                           , '$stateParams'
                                           , 'snapRemote'
                                           , 'CompanyService'
                                           , 'UserService'
                                           , 'UserInterface'
                                           , 'Venue'
                                          ]
