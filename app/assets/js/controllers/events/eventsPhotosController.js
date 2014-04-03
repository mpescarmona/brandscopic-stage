var module = angular.module('brandscopicApp.controllers')
  , controller = function($scope, $state, $stateParams, snapRemote, UserService, CompanyService, UserInterface, Event, Photos, photosService) {

    if( !UserService.isLogged() ) {
      $state.go('login')
      return
    }
    snapRemote.close()

    $scope.loading = true
    $scope.photosList = {}
    $scope.photoForm = {
        key: "",
        AWSAccessKeyId: "",
        policy: "",
        signature: ""
      }

    var
        isPhoto = true
      , ui = {hasMenuIcon: false, hasDeleteIcon: false, hasBackIcon: true, hasMagnifierIcon: false, hasAddIcon: false, hasSaveIcon: false, hasCancelIcon: false, hasCloseIcon: false, showEventSubNav: true, hasCustomHomeClass: false, searching: false, eventSubNav: "photos"}
      , credentials = { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token, event_id: $stateParams.eventId }
      , actions = { success: function(event){
                                    $scope.event = event
                                    // Options for User Interface in home partial
                                    ui.title = event.campaign ? event.campaign.name : "Photos"
                                    ui.hasAddPhoto = Event.can('upload photos')
                                    angular.extend(UserInterface, ui)
                                    $scope.UserInterface = UserInterface
                                    $scope.eventId = $stateParams.eventId
                              }
       }

    $scope.customPermissionsHandler = function() {
      var hasAddIcon = UserService.permissionIsValid('events_create_photos');
      ui.hasAddPhoto = hasAddIcon;
      angular.extend(UserInterface, ui);
    };

    Event.find(credentials, actions)

    $scope.$on('createPhoto', function (e, data) {
      if ( data.render ){
        $scope.loading = false
        $scope.hasPhotos = true
        $scope.photos.unshift({file_medium: data.src})
      }
      else
        Photos.create(credentials, actions, data)
    })

    photosService.getPhotosList().then( function (response) {
        $scope.photos = response.results
        $scope.photosCount = response.results.length
        $scope.hasPhotos =  (response.results.length && response.results.length > 0) ? true : false
        $scope.loading = false
    })
    
    window['uploadNow'].bind({auth_token: UserService.currentUser.auth_token, company_id: CompanyService.getCompanyId(), event_id: $stateParams.eventId, url: 'http://stage.brandscopic.com/api/v1/events/'+ $stateParams.eventId +'/photos/form.json?'})
}

module.controller('eventsPhotosCtrl'
                  , controller).$inject = [  '$scope'
                                           , "$state"
                                           , "$stateParams"
                                           , "snapRemote"
                                           , "UserService"
                                           , "CompanyService"
                                           , "UserInterface"
                                           , "Event"
                                           , "Photos"
                                           , "photosService"
                                          ]
