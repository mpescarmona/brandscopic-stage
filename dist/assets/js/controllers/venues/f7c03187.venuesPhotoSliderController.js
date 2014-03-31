var module = angular.module('brandscopicApp.controllers')
  , controller = function($scope, $state, $stateParams, snapRemote, UserService, CompanyService, UserInterface, Venue) {

    if( !UserService.isLogged() ) {
      $state.go('login')
      return
    }
    snapRemote.close()

    var
        ui = {title: "", hasMenuIcon: false, hasDeleteIcon: false, hasBackIcon: false, hasMagnifierIcon: false, hasAddIcon: false, hasSaveIcon: false, hasEditSurveyIcon: false, hasCancelIcon: false, hasCloseIcon: true, showEventSubNav: false, hasCustomHomeClass: true, CloseState: "home.venues.details.photos", searching: false, venueSubNav: "photos", hasAddPhoto: false}
      , credentials = { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token, venue_id: $stateParams.venueId }
      , actions = { success: function(venue) {
                                $scope.venue = venue

                                var
                                    credentials = { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token, venue_id: $stateParams.venueId }
                                  , actions = { success: function(photos) {
                                                            if (photos.length)
                                                              $scope.hasPhotos = true
                                                            $scope.photos = photos
                                              }
                                    }
                                Venue.photos(credentials, actions)

                                // Options for User Interface in home partial
                                angular.extend(UserInterface, ui)
                                $scope.UserInterface = UserInterface
                                $scope.eventId = $stateParams.eventId

                                //slider
                                $scope.direction = 'left'
                                $scope.currentIndex = $stateParams.index || 0

                                $scope.setCurrentSlideIndex = function (index) {
                                    $scope.direction = (index > $scope.currentIndex) ? 'left' : 'right'
                                    $scope.currentIndex = index
                                }

                                $scope.isCurrentSlideIndex = function (index) {
                                    return Number($scope.currentIndex) === index
                                }

                                $scope.prevSlide = function () {
                                    $scope.direction = 'left'
                                    $scope.currentIndex = ($scope.currentIndex < $scope.photos.length - 1) ? ++$scope.currentIndex : 0
                                }

                                $scope.nextSlide = function () {
                                    $scope.direction = 'right'
                                    $scope.currentIndex = ($scope.currentIndex > 0) ? --$scope.currentIndex : $scope.photos.length - 1
                                }
                            //end slider

                            }
        }

      Venue.find(credentials, actions)
}

module.controller('VenuesPhotoSliderController'
                  , controller).$inject = [  '$scope'
                                           , '$state'
                                           , '$stateParams'
                                           , 'snapRemote'
                                           , 'UserService'
                                           , 'CompanyService'
                                           , 'UserInterface'
                                           , 'Venue'
                                          ]
