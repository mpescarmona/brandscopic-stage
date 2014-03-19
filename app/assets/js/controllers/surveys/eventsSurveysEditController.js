function eventsSurveysEditController($scope, $state, $stateParams, $location,  snapRemote, UserService, CompanyService, surveysService, UserInterface, Event, Surveys) {
    if( !UserService.isLogged() ) {
      $state.go('login');
      return;
    }

    // Inherit from base controller.
    angular.extend(this, new eventsSurveysParentController($scope, surveysService));

    snapRemote.close()
    var ui = {hasMenuIcon: false, hasDeleteIcon: false, hasBackIcon: true, hasMagnifierIcon: false, hasAddIcon: false, hasSaveIcon: false, hasEditSurveyIcon: true, hasCancelIcon: false, hasCloseIcon: false, showEventSubNav: true, hasCustomHomeClass: false, searching: false, eventSubNav: "surveys",  AddIconState: "home.events.details.surveys.edit"}
    var survey_id = $stateParams.survey_id;
    angular.extend(UserInterface, ui)
    $scope.UserInterface = UserInterface;

    function buildSurveyForEdit (surveys_answers) {
        angular.forEach(surveys_answers, function (answer) {
            switch(answer.kpi_id) {
              case 6:
                  $scope.genderModel.genderSelected = parseInt(answer.answer);
                  break;
              case 7:
                  $scope.ageModel.ageSelected = parseInt(answer.answer);
                  break;
              case 8:
                  $scope.raceModel.raceSelected = parseInt(answer.answer);
                  break;
            }

            if(answer.question_id == 1) {
              angular.forEach($scope.questions.brandsQuestion1, function (question1) {
                  if(question1.brand_id == answer.brand_id) {
                    question1.model = answer.answer;
                    question1.id = answer.id;
                  }
              });
            }

            if(answer.question_id == 2) {
              angular.forEach($scope.questions.brandsQuestion2, function (question2) {
                  if(question2.brand_id == answer.brand_id) {
                    $("#question2" + answer.brand_id).val(answer.answer)
                    question2.model = answer.answer;
                    question2.id = answer.id;
                  }
              });
            }

            if(answer.question_id == 3) {
              angular.forEach($scope.questions.brandsQuestion3, function (question3) {
                  if(question3.brand_id == answer.brand_id) {
                    question3.model = parseInt(answer.answer);
                    question3.id = answer.id;
                  }
              });
            }

            if(answer.question_id == 4) {
              angular.forEach($scope.questions.brandsQuestion4, function (question4) {
                  if(question4.brand_id == answer.brand_id) {
                    question4.model = parseInt(answer.answer);
                    question4.id = answer.id;
                  }
              });
            }

        });
    }

    surveysService.getSurveyDetail($stateParams.surveyId).then( function (response){
        buildSurveyForEdit(response.surveys_answers);
    });

    $scope.editSurvey = function() {
        var surveyModel = {
          survey: {
            surveys_answers_attributes: []
          }
        },
        arrayAnswers = [];

        arrayAnswers.push({ kpi_id: 6, answer: $scope.genderModel.genderSelected });
        arrayAnswers.push({ kpi_id: 7, answer: $scope.ageModel.ageSelected });
        arrayAnswers.push({ kpi_id: 8, answer: $scope.raceModel.raceSelected });
        angular.forEach($scope.questions, function (questions) {
            angular.forEach(questions, function (question) {
               arrayAnswers.push({ id: question.id, answer: question.model.toString() });
            })
        });
        surveyModel.survey.surveys_answers_attributes = arrayAnswers;

        surveysService.editSurvey(surveyModel, $stateParams.surveyId).then( function (response) {
            $scope.survey = response
            $location.path("/home/events/" + $stateParams.eventId + "/surveys");
        }, function (response) {
            console.log(response);
        });
    }
}

eventsSurveysEditController.$inject = [
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
