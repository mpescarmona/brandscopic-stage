function eventsSurveysAddController($scope, $state, $stateParams, $location,  snapRemote, UserService, CompanyService, surveysService, UserInterface, Event, Surveys) {
    if( !UserService.isLogged() ) {
      $state.go('login');
      return;
    }

    // Inherit from base controller.
    angular.extend(this, new eventsSurveysParentController($scope, surveysService));

    snapRemote.close()

    var
        ui = {title: "Survey", hasMenuIcon: false, hasDeleteIcon: true, hasBackIcon: false, hasMagnifierIcon: false, hasAddIcon: false, hasSaveIcon: true, hasEditSurveyIcon: false, hasCancelIcon: false, hasCloseIcon: false, showEventSubNav: true, searching: false, eventSubNav: "surveys", AddIconState: ""}
      , credentials = { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token, event_id: $stateParams.eventId }
      , actions = { success: function(event){
                                    $scope.event = event;
                                    // Options for User Interface in home partial
                                    angular.extend(UserInterface, ui)
                                    $scope.UserInterface = UserInterface;
                                    $scope.eventId = $stateParams.eventId;

                                    $scope.createSurvey = function() {
                                        var surveyModel = {
                                          survey: {
                                            surveys_answers_attributes: []
                                          }
                                        }
                                        surveyModel.survey.surveys_answers_attributes.push({ kpi_id: 6, answer: $scope.genderModel.genderSelected });
                                        surveyModel.survey.surveys_answers_attributes.push({ kpi_id: 7, answer: $scope.ageModel.ageSelected });
                                        surveyModel.survey.surveys_answers_attributes.push({ kpi_id: 8, answer: $scope.raceModel.raceSelected });
                                        angular.forEach($scope.questions, function (questions) {
                                            angular.forEach(questions, function (question) {
                                               surveyModel.survey.surveys_answers_attributes.push({ brand_id: question.brand_id, question_id: question.question_id, answer: question.model });
                                            })
                                        });
                                        surveysService.createSurvey(surveyModel).then( function (response) {
                                            $scope.surveyError = false;
                                            $scope.survey = response
                                            $location.path("/home/events/" + event.id + "/surveys")
                                        }, function (response) {
                                            angular.forEach(response, function (value) {
                                                $scope.surveyError = true;
                                            })
                                        });
                                    }
                              }
       }

    Event.find(credentials, actions)
}

eventsSurveysAddController.$inject = [
  '$scope',
  '$state',
  '$stateParams',
  '$location',
  'snapRemote',
  'UserService',
  'CompanyService',
  'surveysService',
  'UserInterface',
  'Event',
  'Surveys'
];
