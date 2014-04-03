'use strict';

/* Services */

angular.module('brandscopicApp.services', ['ngResource', 'ngCookies', 'model.user', 'model.session'])

.service('ApiParams', function() {
    this.baseUrl = "http://stage.brandscopic.com/api/v1";
    this.basePort = "";
})

.service('UserService', ['$cookieStore', 'CompanyService', 'User', function($cookieStore, CompanyService, User) {
	this.currentUser = {  isLogged: false
                    	, email: ''
                    	, auth_token: ''
                      , current_company_id: 0
                      , permissions: {}
                     }

  this.isLogged = function() {
    var sessionData = $cookieStore.get('sessionData')
		return ( sessionData != null)
	}

  this.setUserPermissions = function(authToken, companyId) {
    var
        credentials = { company_id: companyId, auth_token: authToken }
      , actions = { success: function(permissions) {
                                return permissions
                             }
        }

    User.permissions(credentials, actions)
  }

  this.permissionIsValid = function(permission) {
    var canDo = false
    if (this.currentUser.permissions && permission) {
      for (var i = 0, item; item = this.currentUser.permissions[i++];) {
        if (item == permission) {
          canDo = true
          break
        }
      }
    }
    return canDo
  }
}])

.service('CompanyService', function() {
  this.currentCompany = {
    id: 0,
    name: '[Choose Company]',
  };
  this.getCompanyId = function() {
    return this.currentCompany.id;
  };
})

.service('UserInterface', function() {
  this.Title = "";
  this.hasMagnifierIcon = false;
  this.hasAddIcon = false;
  this.hasSaveIcon = false;
  this.hasEditSurveyIcon = false;
  this.hasCancelIcon = false;
  this.hasMenuIcon = true;
  this.hasDeleteIcon = false;
  this.hasBackIcon = false;
  this.hasCloseIcon = false;
  this.searching = false;
  this.AddIconState = "";
  this.CloseState = "";
  this.eventSubNav = "";
  this.venueSubNav = "";
  this.actionSave = "";
  this.showEventSubNav = true;
  this.showVenueSubNav = true;
  this.hasCustomHomeClass = false;
  this.EditIconUrl = "";
  this.noData = false;
  this.hasAddPhoto = false;
})

.service('LoginManager', ['$cookieStore','UserService', 'CompanyService','Session', 'User', function($cookieStore, UserService, CompanyService, Session, User) {
  this.login = function (authToken, email, currentCompanyId, currentCompanyName, permissions) {
    UserService.currentUser.auth_token = authToken;
    UserService.currentUser.email = email;
    UserService.currentUser.permissions = permissions;
    CompanyService.currentCompany.id = currentCompanyId;
    CompanyService.currentCompany.name = currentCompanyName;
    var sessionData = new SessionData(authToken, email, currentCompanyId, currentCompanyName, permissions);
    $cookieStore.put('sessionData', sessionData);
  };

  this.saveSession = function(loginData) {
    $cookieStore.put('sessionData', loginData);
  };

  this.getCurrentSession = function() {
    return $cookieStore.get('sessionData');
  }

  this.initializeSystem = function () {
    if (!this.isLogged()) return false;

    var loginData = $cookieStore.get('sessionData');
    UserService.currentUser.auth_token = loginData.authToken;
    UserService.currentUser.email = loginData.email;
    UserService.currentUser.permissions = loginData.currentPermissions;
    CompanyService.currentCompany.id = loginData.currentCompanyId;
    CompanyService.currentCompany.name = loginData.currentCompanyName;
  };
  this.logout = function (authToken, loggedOutCallback, errorLoggingOutCallback) {
      var
          credentials = { id: authToken }
        , actions = { success: function (login) {
                                  UserService.currentUser.auth_token = "";
                                  UserService.currentUser.isLogged = false;
                                  UserService.currentUser.email = "";
                                  $cookieStore.remove('sessionData');
                                  if (loggedOutCallback != null) {
                                    loggedOutCallback();
                                  }
                      }
                    , error: function (login_error) {
                                  UserService.currentUser.auth_token = "";
                                  UserService.currentUser.isLogged = false;
                                  UserService.currentUser.email = "";
                                  $cookieStore.remove('sessionData');
                                  if (errorLoggingOut != null) {
                                    errorLoggingOutCallback(response);
                                  }
                                  return false;
                      }
                    }

      Session.logout(credentials, actions);
      UserService.currentUser.auth_token = "";
      UserService.currentUser.isLogged = false;
      UserService.currentUser.email = "";
      $cookieStore.remove('sessionData');
      if (loggedOutCallback != null) {
        loggedOutCallback();
      }
  };
  this.isLogged = function () {
    return $cookieStore.get('sessionData') != null;
  };
}])
.service('PermissionsHandler', ['$state', 'UserService', function($state, UserService){

  //Permissions should be an array which contain the permissions a page needs to be accessible. 
  this.handlePermissions = function(permissions) {
    angular.forEach(permissions, function(permission) {
      if (!UserService.permissionIsValid(permission)) {
        $state.go('home.forbidden');
      }
    });
  };
}])

.value('version', '0.1')
.value('loginPage', '/login');
