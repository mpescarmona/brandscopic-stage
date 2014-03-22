var module = angular.module('brandscopicApp.controllers')
  , controller = function($scope, $state, snapRemote, UserService, CompanyService, UserInterface, CompaniesRestClient, User) {

    if( !UserService.isLogged() ) {
      $state.go('login')
      return
    }
    snapRemote.close()

    $scope.currentCompany = CompanyService.currentCompany

    var
        companyData = []
      , authToken = UserService.currentUser.auth_token
      , companies = new CompaniesRestClient.getCompanies(authToken)
      , promise = companies.getCompanies().$promise
      , ui = {}

    promise.then(function(response) {
     if (response.status == 200) {
      if (response.data != null) {
          companyData = response.data

          // Options for User Interface in home partial
          $scope.UserInterface = UserInterface
          ui = { title: 'Companies', hasMenuIcon: true, hasDeleteIcon: false, hasBackIcon: false, hasMagnifierIcon: false, hasAddIcon: false, hasSaveIcon: false, hasEditSurveyIcon: false, hasCancelIcon: false, hasCloseIcon: false, hasCustomHomeClass: false, searching: false}
          angular.extend(UserInterface, ui)

          $scope.companies = companyData
          return
      }
     } else {
        $scope.companies = {}
     }
    })
    promise.catch(function(response) {
      $scope.companies = {}
    })

    $scope.chooseCompany = function(companyId, companyName) {

      var
          credentials = { company_id: companyId, auth_token: authToken }
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
                                           , 'CompaniesRestClient'
                                           , 'User'
                                          ]
