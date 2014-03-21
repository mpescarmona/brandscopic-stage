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

            promiseCompanies.then(function(responseCompanies) {
             if (responseCompanies.status == 200) {
              if (responseCompanies.data != null) {

                var
                    credentials = { company_id: currentCompanyId, auth_token: authToken }
                  , actions = { success: function(permissions) {
                                            UserService.currentUser.permissions = permissions

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
                User.permissions(credentials, actions)
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
