var module = angular.module('brandscopicApp.controllers')
  , controller = function($scope, $rootScope, $state, $stateParams, snapRemote, CompanyService, UserService, UserInterface, Venue) {

    if( !UserService.isLogged() ) {
      $state.go('login')
      return
    }
    snapRemote.close()
    $rootScope.showSearchField = false;
    var
        ui = {}
      , credentials = { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token, venue_id: $stateParams.venueId }
      , actions = { success: function(venue) {
                                ui = {title: venue.name, hasMenuIcon: false, hasDeleteIcon: false, hasBackIcon: true, hasMagnifierIcon: false, hasAddIcon: false, hasSaveIcon: false, hasEditSurveyIcon: false, hasCancelIcon: false, hasCloseIcon: false, showVenueSubNav: true, hasCustomHomeClass: false, searching: false, AddIconState: "home.venues.add", venueSubNav: "about"}
                                $scope.venue = venue
                                angular.extend(UserInterface, ui)
                                $scope.UserInterface = UserInterface
                                $scope.opening = []
                                if (venue.opening_hours != null)
                                  for(var i = 0, item; item = venue.opening_hours[i++];) {
                                    $scope.opening.push( { day: item.substring(0, item.indexOf(" ")),
                                                           hours: item.substring(item.indexOf(" ") + 1, item.length)
                                                         } )
                                  }
                              }
        }
    Venue.find(credentials, actions)

    $scope.map_styles = [
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

module.controller('VenuesAboutController'
                  , controller).$inject = [  '$scope'
                                           , '$rootScope'
                                           , '$state'
                                           , '$stateParams'
                                           , 'snapRemote'
                                           , 'CompanyService'
                                           , 'UserService'
                                           , 'UserInterface'
                                           , 'Venue'
                                          ]
