var module = angular.module('brandscopicApp.controllers')
  , controller = function ($scope, $state, $stateParams, snapRemote, UserService, CompanyService, UserInterface, Event, Photos, photosService) {

    if( !UserService.isLogged() ) {
      $state.go('login')
      return
    }
    snapRemote.close()

    var
        ui = {title: "", hasMenuIcon: false, hasDeleteIcon: false, hasBackIcon: false, hasMagnifierIcon: false, hasAddIcon: false, hasSaveIcon: false, hasEditSurveyIcon: false, hasCancelIcon: false, hasCloseIcon: true, showEventSubNav: false, hasCustomHomeClass: true, CloseState: "home.events.details.photos", searching: false, eventSubNav: "photos", hasAddPhoto: false}
        , credentials = { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token, event_id: $stateParams.eventId }
        , actions = { success: function(event){
        $scope.event = event

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
      photosService.getPhotosList().then( function (response) {
        $scope.photos = response.results
        $scope.photosCount = response.results.length
      })

      Event.find(credentials, actions)

  }

module.controller('EventsPhotoSliderController'
                  , controller).$inject = [  '$scope'
                                           , '$state'
                                           , '$stateParams'
                                           , 'snapRemote'
                                           , 'UserService'
                                           , 'CompanyService'
                                           , 'UserInterface'
                                           , 'Event'
                                           , 'Photos'
                                           , 'photosService'
                                          ]
