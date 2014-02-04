function homeCtrl($scope, $state, snapRemote, UserService, UserInterface, CompanyService, SessionRestClient, Event, $location) {

	if( !UserService.isLogged() ) {
      $state.go('login');
      return;
    }
    $scope.showSearchField = false; 
    // Disable right snap. Works with 'snap-options' option of tag snap-content.
    $scope.snapOptions = {
      disable: 'right'
    };

    var
      authToken = UserService.currentUser.auth_token

    $scope.currentCompany = CompanyService.currentCompany;
    // Options for User Interface in home partial
    $scope.UserInterface = UserInterface;
    $scope.UserInterface.title = "Home";
    $scope.isEventCompleted = true
    $scope.place_reference = ""

    $scope.logout = function() {
      var
          session = new SessionRestClient.logout(authToken)
        , promise = session.logout().$promise

      promise.then(function(response) {
        if (response.status == 200) {
          UserService.currentUser.auth_token = "";
          UserService.currentUser.isLogged = false;
          UserService.currentUser.email = "";
          $state.go('login');
          return;
        } else {
          // $state.go('login');
          $scope.wrongUser = true;
          UserService.currentUser.auth_token = "";
          UserService.currentUser.isLogged = false;
          UserService.currentUser.email = "";
        }
      });
      promise.catch(function(response) {
        $scope.wrongUser = true;
        UserService.currentUser.auth_token = "";
        UserService.currentUser.isLogged = false;
        UserService.currentUser.email = "";
      });
    };

  $scope.photoForm = { 
      key: "",
      AWSAccessKeyId: "",
      policy: "",
      signature: ""
  };

	$scope.showSearchEvent = function(isShowing) {
		$scope.showSearchField = isShowing;
	};	

    $scope.navigationItems = [{'class': 'eventIcon', 'label': 'EVENTS', 'link': '#home/events'},
                              {'class': 'tasksIcon', 'label': 'TASKS',  'link': '#home/tasks'},
                              {'class': 'venuesIcon', 'label': 'VENUES', 'link': '#home/venues'},
                              {'class': 'notificationIcon', 'label': 'NOTIFICATIONS', 'link': '#home/notifications'},
                              {'class': 'dashboardIcon', 'label': 'DASHBOARD', 'link': '#home/dashboard'}];

    $scope.actionItems = [{'class': 'profileIcon', 'label': 'EDIT PROFILE', 'link': '#home/profile', 'click': ''},
                          {'class': 'logoutIcon', 'label': 'LOGOUT', 'link': '#', 'click': 'logout()'}];



    function createEvent () {
      var
          credentials = { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token }
        , actions = { success: function (event) {
                            $scope.event = event
                            $location.path("/home/events/" + event.id + "/about")
                      }
                    , error: function (event_error) {
                        $scope.event_error = event_error
                         console.log(event_error)
                      }
                    }
        , sm1 = $scope.event.start_date.indexOf('-')
        , sm2 = $scope.event.start_date.indexOf('/')
        , em1 = $scope.event.end_date.indexOf('-')
        , em2 = $scope.event.end_date.indexOf('/')
      if (sm1 == 4)
        $scope.event.start_date = $scope.event.start_date.replace(/^(\d{4})\-(\d{2})\-(\d{2}).*$/, '$2/$3/$1')
      if (sm2 == 4)
        $scope.event.start_date = $scope.event.start_date.replace(/^(\d{4})\/(\d{2})\/(\d{2}).*$/, '$2/$3/$1')
      if (em1 == 4)
        $scope.event.end_date = $scope.event.end_date.replace(/^(\d{4})\-(\d{2})\-(\d{2}).*$/, '$2/$3/$1')
      if (em2 == 4)
        $scope.event.end_date = $scope.event.end_date.replace(/^(\d{4})\/(\d{2})\/(\d{2}).*$/, '$2/$3/$1')

      Event.create(credentials, actions, $scope.event)
    }

    $scope.CreateEventView = function () {
        $scope.isEventCompleted = true
        if($scope.event) {
          createEvent();
        }
    }

    $scope.$on('CREATE_EVENT', function (eventT, eventObj) {
        if ( eventObj.campaign_id && eventObj.end_date  &&  eventObj.end_time && eventObj.start_date && eventObj.start_time) {
            $scope.isEventCompleted = false
            $scope.event = eventObj;
        }
        event.processed = true;
    });

    function G() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
    }

    $scope.$watch('photoName', function (value){
        var guid = (G() + G() + "-" + G() + "-" + G() + "-" + G() + "-" + G() + G() + G()).toUpperCase();
        $scope.photoForm.key = "uploads/" + guid + "/" + value
        sentForm()
    })

  function sentForm() {
      var url = $scope.photoForm.url; // El script a dónde se realizará la petición.
      var formData = { 
                       key:$scope.photoForm.key, 
                       AWSAccessKeyId: $scope.photoForm.AWSAccessKeyId, 
                       acl: "public-read", 
                       success_action_redirect: "http://localhost/", 
                       policy: $scope.photoForm.policy, 
                       signature: $scope.photoForm.signature, 
                       ContentType: "image/jpeg" 
                     };
                     
      console.log($scope.photoForm.url)
      console.log(formData)

      $.ajax({
            type: "POST",
             url: $scope.photoForm.url,
             data: formData, // Adjuntar los campos del formulario enviado.
              success: function(data, textStatus, jqXHR) {
                   console.log(data)
               },
              error: function (jqXHR, textStatus, errorThrown) {
                  console.log(textStatus)
                  console.log(errorThrown)
              }
           });
      }

    $scope.$on('ADD_PHOTO', function (eventT, authForm) {
        //$scope.photoForm.key = authForm.fields.key
        $scope.photoForm.AWSAccessKeyId = authForm.fields.AWSAccessKeyId
        $scope.photoForm.policy = authForm.fields.policy
        $scope.photoForm.signature = authForm.fields.signature
        $scope.photoForm.url = authForm.url
    })

}

homeCtrl.$inject = [
    "$scope",
    "$state",
    "snapRemote",
    "UserService",
    "UserInterface",
    "CompanyService",
    "SessionRestClient",
    "Event",
    "$location"
];