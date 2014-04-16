'use strict';

/* Controllers */

angular.module('brandscopicApp.controllers', ['model.event', 'model.campaign', 'model.expense', 'model.comment', 'model.eventContact', 'model.eventTeam', 'model.contact', 'model.country', 'model.venue', 'highcharts-ng', 'model.notification', 'model.company', 'model.session'])
  .controller('MainController', ['$scope', 'UserService', 'SessionService', function($scope, UserService, SessionService) {
    $scope.UserService = UserService;
    $scope.trigger = function (event, payload) {
      $scope.$broadcast(event, payload);
    }
  }])

  .controller('LoginController', ['$scope', '$state', 'UserService', 'CompanyService', 'Company', 'User', 'SessionService','LoginManager', 'Session', function($scope, $state, UserService, CompanyService, Company, User, SessionService, LoginManager, Session) {
    if (LoginManager.isLogged()) {
      $state.go('home.dashboard');
      return;
    }

    $scope.shouldKeepLoggedIn = false;
    $scope.user = {'email': '', 'password': ''};

    $scope.wrongUser = null;
    $scope.validateApiUser = function() {
      var
          credentials = { email: $scope.user.email, password: $scope.user.password }
        , actions = { success: function (login) {

                                  $scope.wrongUser = false;
                                  var 
                                      authToken = login.data.auth_token
                                    , currentCompanyId = login.data.current_company_id
                                    , credentials = { auth_token: authToken }
                                    , action = { success: function(companies) {
                                                                var
                                                                    credentials = { company_id: currentCompanyId, auth_token: authToken }
                                                                  , actions = { success: function(permissions) {
                                                                                            UserService.currentUser.permissions = permissions

                                                                                            for (var i = 0, company; company = companies[i++];) {
                                                                                              if (company.id == currentCompanyId) {
                                                                                                CompanyService.currentCompany.id = company.id;
                                                                                                CompanyService.currentCompany.name = company.name;
                                                                                                LoginManager.login(login.data.auth_token, $scope.user.email, company.id, company.name, permissions);
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
                                  Company.all(credentials, action)
                      }
                    , error: function (login_error) {
                                  $scope.wrongUser = true
                                  UserService.currentUser.auth_token = ""
                                  UserService.currentUser.isLogged = false
                                  UserService.currentUser.email = ""
                      }
                    }

      Session.login(credentials, actions)
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

    $scope.handleKeepMeLoggedInClicked = function(value) {
      var storageType = value ? 'local' : 'session';
      SessionService.setStorageType(storageType);
    };

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

    $scope.handleKeepMeLoggedInClicked($scope.shouldKeepLoggedIn);
    
    //Used in order to delete the login error message once the user starts inputting the email again
    $scope.$watch("user.email", function(value) {
      $scope.wrongUser = false;
    });

  }])
