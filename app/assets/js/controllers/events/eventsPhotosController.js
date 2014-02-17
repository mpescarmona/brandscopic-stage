function eventsPhotosCtrl($scope, $state, $stateParams, snapRemote, UserService, CompanyService, UserInterface, Event, Photos, photosService) {
    if( !UserService.isLogged() ) {
      $state.go('login');
      return;
    }
    snapRemote.close()
    $scope.photosList = {}
    $scope.photoForm = {
        key: "",
        AWSAccessKeyId: "",
        policy: "",
        signature: ""
      };

    var
        isPhoto = true
      , ui = {hasMenuIcon: false, hasDeleteIcon: false, hasBackIcon: true, hasMagnifierIcon: false, hasAddIcon: false, hasSaveIcon: false, hasCancelIcon: false, hasCloseIcon: false, showEventSubNav: true, hasCustomHomeClass: false, searching: false, eventSubNav: "photos"}
      , credentials = { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token, event_id: $stateParams.eventId }
      , actions = { success: function(event){
                                    $scope.event = event;
                                    // Options for User Interface in home partial
                                    ui.title = event.campaign ? event.campaign.name : "Photos"
                                    ui.hasAddPhoto = Event.can('upload photos')
                                    angular.extend(UserInterface, ui)
                                    $scope.UserInterface = UserInterface;
                                    $scope.eventId = $stateParams.eventId;
                              }
       }

    Event.find(credentials, actions)

    $scope.$on('createPhoto', function (e, data) {
      debugger
      Photos.create(credentials, actions, data)
    })

    photosService.getPhotosList().then( function (response) {
        $scope.photos = response.results;
        $scope.photosCount = response.results.length;
        console.log($scope.photos)
    })
    window['uploadNow'].bind({auth_token: UserService.currentUser.auth_token, company_id: CompanyService.getCompanyId(), event_id: $stateParams.eventId, url: 'http://stage.brandscopic.com/api/v1/events/'+ $stateParams.eventId +'/photos/form.json?'})
}

eventsPhotosCtrl.$inject = [
    "$scope",
    "$state",
    "$stateParams",
  	"snapRemote",
  	"UserService",
  	"CompanyService",
  	"UserInterface",
  	"Event",
    "Photos",
    "photosService"
];
