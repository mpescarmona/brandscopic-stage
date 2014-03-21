var module = angular.module('brandscopicApp.controllers')
  , controller = function($q, $scope, $rootScope, $state, $timeout, snapRemote, $sce, UserService, UserInterface, CompanyService, SessionRestClient, Event, $location, $http, Notification, LoginManager, HistoryService) {

  if( !LoginManager.isLogged() ) {
    $state.go('login')
    return
  } else {
    LoginManager.initializeSystem()
  }
  $rootScope.showSearchField = false
  // Disable right snap. Works with 'snap-options' option of tag snap-content.
  $scope.snapOptions = {
    disable: 'right'
  }

  var
      authToken = UserService.currentUser.auth_token,
      credentials = { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token, 'status[]': 'Active' },
      pendingNotifications = 0,
      notificationsQueryingPromise = null

  $scope.currentCompany = CompanyService.currentCompany
  // Options for User Interface in home partial
  $scope.UserInterface = UserInterface
  $scope.UserInterface.title = "Home"
  $scope.isEventCompleted = true
  $scope.place_reference = ""

  $scope.logout = function() {
    LoginManager.logout(authToken, function() { 
      $state.go('login')
    })
    return false
  }

  $scope.photoForm = {
      key: "",
      AWSAccessKeyId: "",
      policy: "",
      signature: ""
  }

	$scope.showSearchEvent = function(isShowing) {
    $("#searchEvent").val("")
		$rootScope.showSearchField = isShowing
    if(!isShowing) {
      $scope.$broadcast("CLOSE_SEARCH", true)
    }
    $scope.$broadcast("ALL_EVENT", isShowing)
	}

  $scope.navigationItems = [{'class': 'eventIcon'       , 'label': 'EVENTS'       , 'link': '#home/events'                                  },
                            {'class': 'tasksIcon'       , 'label': 'TASKS'        , 'link': '#home/tasks'                                   },
                            {'class': 'venuesIcon'      , 'label': 'VENUES'       , 'link': '#home/venues'                                  },
                            {'class': 'notificationIcon', 'label': 'NOTIFICATIONS', 'link': '#home/notifications', 'showNotifications': true},
                            {'class': 'dashboardIcon'   , 'label': 'DASHBOARD'    , 'link': '#home/dashboard'                               }]

  $scope.actionItems = [{'class': 'profileIcon', 'label': 'EDIT PROFILE', 'link': '#home/profile', 'click': ''},
                        {'class': 'logoutIcon', 'label': 'LOGOUT', 'link': '', 'click': 'logout()'}]


  function sentForm() {
    var url = $scope.photoForm.url // The script where the request will be made
    var formData = {
                     key:$scope.photoForm.key,
                     AWSAccessKeyId: $scope.photoForm.AWSAccessKeyId,
                     acl: "private",
                     success_action_redirect: "http://localhost/",
                     policy: $scope.photoForm.policy,
                     signature: $scope.photoForm.signature,
                     ContentType: "image/jpeg"
                   }

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
         })
  }

  $scope.$on('ADD_PHOTO', function (eventT, authForm) {
      $scope.photoForm.AWSAccessKeyId = authForm.fields.AWSAccessKeyId
      $scope.photoForm.policy = authForm.fields.policy
      $scope.photoForm.signature = authForm.fields.signature
      $scope.photoForm.url = authForm.url
  })

  $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
    var numberOfPoints = toState.name.split('.').length - 1
    var isGoingToARootPlace = numberOfPoints == 1
    if (isGoingToARootPlace) {
      HistoryService.clearHistory()
      HistoryService.addState(toState)
    } else {
      if (toState.data && toState.data.parentShouldBeRemembered) {
        HistoryService.addState(fromState)
      }
      if (toState.data && toState.data.shouldRememberInHistory) {
        HistoryService.addState(toState)
      }
    }
  })

  $scope.$on('CompanyChosen', function (event, companyId, companyName) {
    credentials.company_id = companyId
    var data = LoginManager.getCurrentSession()
    data.currentCompanyId = companyId
    data.currentCompanyName = companyName

    LoginManager.saveSession(data)
    //We cancel the querying action because otherwise after calling Notification.all again we'd get two chronic jobs.
    $timeout.cancel(notificationsQueryingPromise)
    Notification.all(credentials, notificationsActions, true)
  })

  /*
   * Wait for trigger of the event SEARCH_DIRECTIVE and set if the typahead will search events or venues
   * @source: would be "events or venues".
   */
  $scope.$on('SEARCH_DIRECTIVE', function (event, source) {
      $scope.source = source
  })

  var notificationsActions = { success: function(notifications) {
    pendingNotifications = notifications.length
    $timeout(function() { Notification.all(credentials, notificationsActions, true) }, 30000) //Check the notifications every 30 seconds
  }}

  $scope.getPendingNotifications = function() {
    return pendingNotifications
  }

  Notification.all(credentials, notificationsActions, true)
}

module.controller('homeCtrl'
                  , controller).$inject = [  '$q'
                                           , '$scope'
                                           , '$rootScope'
                                           , '$state'
                                           , '$timeout'
                                           , 'snapRemote'
                                           , '$sce'
                                           , 'UserService'
                                           , 'UserInterface'
                                           , 'CompanyService'
                                           , 'SessionRestClient'
                                           , 'Event'
                                           , '$location'
                                           , '$http'
                                           , 'Notification'
                                           , 'LoginManager'
                                           , 'HistoryService'
                                          ]
