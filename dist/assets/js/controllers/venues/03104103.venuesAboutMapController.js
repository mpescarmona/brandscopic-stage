var module = angular.module('brandscopicApp.controllers')
  , controller = function($scope, $window, $state, $stateParams, snapRemote, UserService, CompanyService, UserInterface, Venue) {

    if( !UserService.isLogged() ) {
      $state.go('login')
      return
    }
    snapRemote.close()

    var
        ui = {hasMenuIcon: false, hasDeleteIcon: true, hasBackIcon: false, hasMagnifierIcon: false, hasAddIcon: false, hasSaveIcon: false, hasEditSurveyIcon: false, hasCancelIcon: false, hasCloseIcon: false, showVenueSubNav: false, hasCustomHomeClass: false, searching: false, venueSubNav: "about"}
      , credentials = { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token, venue_id: $stateParams.venueId }
      , actions = { success: function(venue){
                                    $scope.venue = venue

                                    // Options for User Interface in home partial
                                    ui.title = venue.name
                                    angular.extend(UserInterface, ui)
                                    $scope.UserInterface = UserInterface
                              }
       }

    Venue.find(credentials, actions)

    $scope.map_styles     =  [
                {
                        stylers: [
                                { hue: "#00ffe6" },
                                { saturation: -100 },
                                { gamma: 0.8 }
                        ]
                },{
                        featureType: "road",
                        elementType: "geometry",
                        stylers: [
                                { lightness: 100 },
                                { visibility: "simplified" }
                        ]
                },{
                        featureType: "road",
                        elementType: "labels",
                        stylers: [
                                { visibility: "off" }
                        ]
                },{
                        featureType: "road.arterial",
                        elementType: "geometry",
                        stylers: [
                                { color: "#BABABA" }
                        ]
                }
        ]
}

module.controller('VenuesAboutMapController'
                  , controller).$inject = [  '$scope'
                                           , '$window'
                                           , '$state'
                                           , '$stateParams'
                                           , 'snapRemote'
                                           , 'UserService'
                                           , 'CompanyService'
                                           , 'UserInterface'
                                           , 'Venue'
                                          ]
