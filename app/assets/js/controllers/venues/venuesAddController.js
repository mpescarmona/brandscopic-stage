function VenuesAddController($scope, $state, snapRemote, CompanyService, UserService, UserInterface, Venue) {
    if( !UserService.isLogged() ) {
      $state.go('login')
      return
    }
    snapRemote.close()

    var
        ui = { title: 'Venue', hasMenuIcon: false, hasDeleteIcon: true, hasBackIcon: false, hasMagnifierIcon: false, hasAddIcon: false, hasSaveIcon: true, hasCancelIcon: false, hasCloseIcon: false, hasCustomHomeClass: false, searching: false}

    // Options for User Interface in home partial
    angular.extend(UserInterface, ui)
    $scope.UserInterface = UserInterface
}

VenuesAddController.$inject = [  '$scope'
                               , '$state'
                               , 'snapRemote'
                               , 'CompanyService'
                               , 'UserService'
                               , 'UserInterface'
                               , 'Venue'
                              ]
