'use strict';

/* Controllers */

angular.module('brandscopicApp.controllers', ['model.event', 'model.campaign', 'model.expense', 'model.comment', 'model.eventContact', 'model.eventTeam', 'model.contact', 'model.country', 'model.venue', 'highcharts-ng', 'model.notification', 'ngCookies'])
  .controller('MainController', ['$scope', 'UserService', function($scope, UserService) {
    $scope.UserService = UserService;
    $scope.trigger = function (event, payload) {
      $scope.$broadcast(event, payload);
    }
  }])

  .controller('LoginController', ['$scope', '$state', 'UserService', 'CompanyService', 'SessionRestClient', 'CompaniesRestClient', 'User', '$cookieStore','LoginManager', function($scope, $state, UserService, CompanyService, SessionRestClient, CompaniesRestClient, User, $cookieStore, LoginManager) {
    if (LoginManager.isLogged()) {
      $state.go('home.dashboard');
      return;
    }

    $scope.user = {'email': 'mpescarmona@gmail.com', 'password': 'Mario123'};

    $scope.wrongUser = null;
    $scope.validateApiUser = function() {
      var
          session = new SessionRestClient.login($scope.user.email, $scope.user.password)
        , promiseLogin = session.login().$promise
        , companyData = []
        , authToken = UserService.currentUser.auth_token
        , companies = null
        , promiseCompanies = null

      promiseLogin.then(function(response) {
       if (response.status == 200) {
        if (response.data.success == true) {
            $scope.wrongUser = false;
            var authToken = response.data.data.auth_token;
            var currentCompanyId = response.data.data.current_company_id;

            companies = new CompaniesRestClient.getCompanies(authToken)
            promiseCompanies = companies.getCompanies().$promise

            UserService.setUserPermissions(authToken, currentCompanyId)

            promiseCompanies.then(function(responseCompanies) {
             if (responseCompanies.status == 200) {
              if (responseCompanies.data != null) {
                  companyData = responseCompanies.data;
                  for (var i = 0, company; company = companyData[i++];) {
                    if (company.id == currentCompanyId) {
                      CompanyService.currentCompany.id = company.id;
                      CompanyService.currentCompany.name = company.name;
                      LoginManager.login(response.data.data.auth_token, $scope.user.email, company.id, company.name);
                      $state.go('home.dashboard');
                      break;
                    }
                  }
                  return;
              }
             }
            });
            return;
        }
       } else {
          $scope.wrongUser = true;
          UserService.currentUser.auth_token = "";
          UserService.currentUser.isLogged = false;
          UserService.currentUser.email = "";
       }
      });
      promiseLogin.catch(function(response) {
        $scope.wrongUser = true;
        UserService.currentUser.auth_token = "";
        UserService.currentUser.isLogged = false;
        UserService.currentUser.email = "";
      });
    };

    $scope.forgotPassword = function(email) {
      var
          credentials = { email: email }
        , actions = { success: function (forgot) {
                            UserService.currentUser.isLogged = false
                            UserService.currentUser.email = ""
                            $state.go('login')
                      }
                    , error: function (forgot_error) {
                            $scope.wrongUser = true;
                            UserService.currentUser.auth_token = "";
                            UserService.currentUser.isLogged = false;
                            UserService.currentUser.email = "";
                      }
                    }

      User.forgotPassword(credentials, actions)
    }

    $scope.keyUpClear = function (e) {
        this.nextSibiling.className = (this.value.length) ? 'type-reset hidden' : 'type-reset'
    }

    $scope.keyDownClear = function (e) {
        this.value = ''
        this.netxSibiling.className = 'type-reset'
    }

    $scope.clickClear =  function (e){
        this.className = 'type-reset hidden'
        this.previousSibiling.value = ''
    }

  }])

  .controller('TasksController', ['$scope', '$state', 'snapRemote', 'UserService', 'UserInterface',  function($scope, $state, snapRemote, UserService, UserInterface) {
    if( !UserService.isLogged() ) {
      $state.go('login');
      return;
    }
    snapRemote.close();

    var
        ui = { title: 'Tasks', hasMagnifierIcon: false, hasAddIcon: false, hasSaveIcon: false, hasEditSurveyIcon: false, hasCancelIcon: false, hasCustomHomeClass: false, searching: false}

    // Options for User Interface in home partial
    angular.extend(UserInterface, ui);
    $scope.UserInterface = UserInterface;
  }])

  .controller('CompaniesController', ['$scope', '$state', 'snapRemote', 'UserService', 'CompanyService', 'UserInterface', 'CompaniesRestClient', 'User', function($scope, $state, snapRemote, UserService, CompanyService, UserInterface, CompaniesRestClient, User) {
    if( !UserService.isLogged() ) {
      $state.go('login');
      return;
    }
    snapRemote.close();

    $scope.currentCompany = CompanyService.currentCompany;

    var
        companyData = []
      , authToken = UserService.currentUser.auth_token
      , companies = new CompaniesRestClient.getCompanies(authToken)
      , promise = companies.getCompanies().$promise
      , ui = {}

    promise.then(function(response) {
     if (response.status == 200) {
      if (response.data != null) {
          companyData = response.data;

          // Options for User Interface in home partial
          $scope.UserInterface = UserInterface;
          ui = { title: 'Companies', hasMenuIcon: true, hasDeleteIcon: false, hasBackIcon: false, hasMagnifierIcon: false, hasAddIcon: false, hasSaveIcon: false, hasEditSurveyIcon: false, hasCancelIcon: false, hasCloseIcon: false, hasCustomHomeClass: false, searching: false};
          angular.extend(UserInterface, ui);

          $scope.companies = companyData;
          return;
      }
     } else {
        $scope.companies = {};
     }
    });
    promise.catch(function(response) {
      $scope.companies = {};
    });

    $scope.chooseCompany = function(companyId, companyName) {
      UserService.setUserPermissions(UserService.currentUser.auth_token, companyId)
      CompanyService.currentCompany.id = companyId
      CompanyService.currentCompany.name = companyName
      $scope.$emit('CompanyChosen', companyId, companyName)
      $state.go('home.dashboard')
      return
    };
  }])

  // .controller('EventsPhotoSliderController', ['$scope', '$state', '$stateParams', 'snapRemote', 'UserService', 'CompanyService', 'UserInterface', 'Event',  'Photos', 'photosService', function($scope, $state, $stateParams, snapRemote, UserService, CompanyService, UserInterface, Event, Photos, photosService) {
  //   if( !UserService.isLogged() ) {
  //     $state.go('login');
  //     return;
  //   }
  //   snapRemote.close()

  //   var
  //       ui = {title: "", hasMenuIcon: false, hasDeleteIcon: false, hasBackIcon: false, hasMagnifierIcon: false, hasAddIcon: false, hasSaveIcon: false, hasEditSurveyIcon: false, hasCancelIcon: false, hasCloseIcon: true, showEventSubNav: false, hasCustomHomeClass: true, CloseState: "home.events.details.photos", searching: false, eventSubNav: "photos", hasAddPhoto: false}
  //       , credentials = { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token, event_id: $stateParams.eventId }
  //       , actions = { success: function(event){
  //       $scope.event = event;

  //       // Options for User Interface in home partial
  //       angular.extend(UserInterface, ui)
  //       $scope.UserInterface = UserInterface;
  //       $scope.eventId = $stateParams.eventId;

  //       //slider
  //       $scope.direction = 'left';
  //       $scope.currentIndex = $stateParams.index || 0;

  //       $scope.setCurrentSlideIndex = function (index) {
  //           $scope.direction = (index > $scope.currentIndex) ? 'left' : 'right';
  //           $scope.currentIndex = index;
  //       };

  //       $scope.isCurrentSlideIndex = function (index) {
  //           return Number($scope.currentIndex) === index;
  //       };

  //       $scope.prevSlide = function () {
  //           $scope.direction = 'left';
  //           $scope.currentIndex = ($scope.currentIndex < $scope.photos.length - 1) ? ++$scope.currentIndex : 0;
  //       };

  //       $scope.nextSlide = function () {
  //           $scope.direction = 'right';
  //           $scope.currentIndex = ($scope.currentIndex > 0) ? --$scope.currentIndex : $scope.photos.length - 1;
  //       };
  //   //end slider

  //       }
  //     }
  //     photosService.getPhotosList().then( function (response) {
  //       $scope.photos = response.results;
  //       $scope.photosCount = response.results.length;
  //     })

  //     Event.find(credentials, actions)

  // }])

  .controller('NotificationsController',['$scope', 'Notification', 'snapRemote', 'UserService', 'CompanyService', '$state', 'UserInterface', function($scope, Notification, snapRemote, UserService, CompanyService, $state, UserInterface) {
    //This function is used in order to save the scope of the id parameter.
    function actionCreator(destinationState, parameters) {
      return function() {
        if (destinationState) {
          $state.go(destinationState, parameters);
        }
      };
    }
    snapRemote.close();

    var ui = { title: 'Notifications', hasMenuIcon: true, hasMagnifierIcon: false, hasAddIcon: false, hasSaveIcon: false, hasEditSurveyIcon: false, hasCancelIcon: false, hasCustomHomeClass: false, searching: false, hasBackIcon: false}
    angular.extend(UserInterface, ui);

    var credentials = { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token, 'status[]': 'Active' };
    var actions = {
      success: function(notifications) {
        var viewModel = [];
        for (var i = 0; i < notifications.length; i++) {
          var notification = notifications[i];
          var destinationState = null;
          var parameters = {};
          if (notification.event_id) {
            parameters = { eventId: notification.event_id };
            destinationState = 'home.events.details.about';
          } else if (notification.type === 'event_recaps_due') {
            parameters = { filter: 'due' };
            destinationState = 'home.events';
          } else if (notification.type === 'event_recaps_late') {
            parameters = { filter: 'late' };
            destinationState = 'home.events';
          } else if (notification.type === 'event_recaps_pending') {
            parameters = { filter: 'pending' };
            destinationState = 'home.events';
          } else if (notification.type === 'event_recaps_rejected') {
            parameters = { filter: 'rejected' };
            destinationState = 'home.events';
          }
          //TODO: Redirect to a task once we have a tasks endpoint.

          var colorClass = Notification.getNotificationClass(notification);
          viewModel.push({
              message: notification.message,
              level: notification.level,
              type: notification.type.indexOf('task') != -1 ? 'tasks' 
                    : notification.type.indexOf('event') != -1 ? 'event' : '',
              action: actionCreator(destinationState, parameters),
              colorClass: colorClass
            });
        }
        $scope.notifications = viewModel;
      }
    }
    Notification.all(credentials, actions)
  }]);
