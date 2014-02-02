function eventsPhotosCtrl($scope, $state, $stateParams, snapRemote, UserService, CompanyService, UserInterface, Event, Photos) {
    if( !UserService.isLogged() ) {
      $state.go('login');
      return;
    }
    snapRemote.close()

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
        console.log(value)
        var guid = (G() + G() + "-" + G() + "-" + G() + "-" + G() + "-" + G() + G() + G()).toUpperCase();
        $scope.photoForm.key = "uploads/" + guid + "/" + "ale.jpg"
        console.log($scope.photoForm)
    })

    var
        isPhoto = true
      , ui = {hasMenuIcon: false, hasDeleteIcon: false, hasBackIcon: true, hasMagnifierIcon: false, hasAddIcon: true, hasSaveIcon: false, hasCancelIcon: false, hasCloseIcon: false, showEventSubNav: true, hasCustomHomeClass: false, searching: false, eventSubNav: "photos"}
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

      , actionsPhoto = { success: function(response){
                                  $scope.photoForm.key = $scope.photoName;
                                  $scope.photoForm.AWSAccessKeyId = response.fields.AWSAccessKeyId;
                                  $scope.photoForm.policy = response.fields.policy
                                  $scope.photoForm.signature = response.fields.signature;
                                  console.log($scope.photoForm);
                              }
       }

    Event.find(credentials, actions)
    Photos.form(credentials, actionsPhoto)
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
    "Photos"
];