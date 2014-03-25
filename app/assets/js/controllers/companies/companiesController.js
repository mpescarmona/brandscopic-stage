var module = angular.module('brandscopicApp.controllers')
  , controller = function($scope, $state, snapRemote, UserService, CompanyService, UserInterface, User, Company) {

    if( !UserService.isLogged() ) {
      $state.go('login')
      return
    }
    snapRemote.close()

    $scope.currentCompany = CompanyService.currentCompany
    $scope.companies = {}

    var
        credentials = { auth_token: UserService.currentUser.auth_token }
      , action = { success: function(companies) {
                                  // Options for User Interface in home partial
                                  $scope.UserInterface = UserInterface
                                  ui = { title: 'Companies', hasMenuIcon: true, hasDeleteIcon: false, hasBackIcon: false, hasMagnifierIcon: false, hasAddIcon: false, hasSaveIcon: false, hasEditSurveyIcon: false, hasCancelIcon: false, hasCloseIcon: false, hasCustomHomeClass: false, searching: false}
                                  angular.extend(UserInterface, ui)

                                  $scope.companies = companies
                             }
                }
    Company.all(credentials, action)

    $scope.chooseCompany = function(companyId, companyName) {

      var
          credentials = { company_id: companyId, auth_token: UserService.currentUser.auth_token }
        , actions = { success: function(permissions) {
                                  UserService.currentUser.permissions = permissions

                                  CompanyService.currentCompany.id = companyId
                                  CompanyService.currentCompany.name = companyName
                                  $scope.$emit('CompanyChosen', companyId, companyName, permissions)
                                  $state.go('home.dashboard')
                                  return
                               }
          }

      User.permissions(credentials, actions)
    }
  }

module.controller('CompaniesController'
                  , controller).$inject = [  '$scope'
                                           , '$state'
                                           , 'snapRemote'
                                           , 'UserService'
                                           , 'CompanyService'
                                           , 'UserInterface'
                                           , 'User'
                                           , 'Company'
                                          ]
