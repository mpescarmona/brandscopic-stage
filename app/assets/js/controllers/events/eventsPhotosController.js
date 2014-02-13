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

    function G() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
    }


    $scope.$watch('photoName', function (value){
        if(value) {
          var guid = (G() + G() + "-" + G() + "-" + G() + "-" + G() + "-" + G() + G() + G()).toUpperCase();
          $scope.photoForm.key = "uploads/" + guid + "/" + value.split(/(\\|\/)/g).pop()
          console.log($scope.photoForm);
        }
    })

    var
        isPhoto = true
      , ui = {hasMenuIcon: false, hasDeleteIcon: false, hasBackIcon: true, hasMagnifierIcon: false, hasAddIcon: false, hasSaveIcon: false, hasCancelIcon: false, hasCloseIcon: false, showEventSubNav: true, hasCustomHomeClass: false, searching: false, eventSubNav: "photos", hasAddPhoto: true}
      , credentials = { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token, event_id: $stateParams.eventId }
      , actions = { success: function(event){
                                    $scope.event = event;
                                    // Options for User Interface in home partial
                                    ui.title = event.campaign ? event.campaign.name : "Photos"
                                    angular.extend(UserInterface, ui)
                                    $scope.UserInterface = UserInterface;
                                    $scope.eventId = $stateParams.eventId;
                              }
       }

    Event.find(credentials, actions)

    photosService.getPhotoAmazonAuth().then( function (response) {
        $scope.$emit("ADD_PHOTO", response)
        $scope.photoForm.key = $scope.photoName;
        $scope.photoForm.AWSAccessKeyId = response.fields.AWSAccessKeyId;
        $scope.photoForm.policy = response.fields.policy
        $scope.photoForm.signature = response.fields.signature;
        $scope.photoForm.postUrl = response.url;
        $("#photoForm").attr("action", response.url)
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
