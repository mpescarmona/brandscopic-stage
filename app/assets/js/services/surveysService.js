angular.module('brandscopicApp.surveysService', []).
    factory('surveysService', ['$q', 'CompanyService', 'UserService', '$stateParams', 'Surveys', function ($q, CompanyService, UserService, $stateParams, Surveys) {
        'use strict';

 		var _genders = Object.freeze([
 			{
 				key: scopic.consts.surveys_question_gender.MALE,
 				value: "Male"
 			},
 			{
 				key: scopic.consts.surveys_question_gender.FEMALE,
 				value: "Female"
 			}
 		]);

  		var _races= Object.freeze([
 			{
 				key: scopic.consts.surveys_question_race.ASIAN,
 				value: "Asian"
 			},
 			{
 				key: scopic.consts.surveys_question_race.BLACK,
 				value: "African American"
 			},
 			{
 				key: scopic.consts.surveys_question_race.LATINO,
 				value: "Hispanic Latino"
 			},
 			{
 				key: scopic.consts.surveys_question_race.AMERICAN,
 				value: "Native Americans"
 			},
 			{
 				key: scopic.consts.surveys_question_race.WHITE,
 				value: "White"
 			}
 		]);

  		var _ages= Object.freeze([
 			{
 				key: scopic.consts.surveys_question_age.LESS12,
 				value: "<12"
 			},
 			{
 				key: scopic.consts.surveys_question_age.BETWEEN_12_17,
 				value: "12-17"
 			},
 			{
 				key: scopic.consts.surveys_question_age.BETWEEN_18_20,
 				value: "18-20"
 			},
 			{
 				key: scopic.consts.surveys_question_age.BETWEEN_21_24,
 				value: "21-24"
 			},
 			{
 				key: scopic.consts.surveys_question_age.BETWEEN_25_34,
 				value: "25-34"
 			},
 			{
 				key: scopic.consts.surveys_question_age.BETWEEN_35_44,
 				value: "35-44"
 			},
 			{
 				key: scopic.consts.surveys_question_age.BETWEEN_45_54,
 				value: "45-54"
 			},
 			{
 				key: scopic.consts.surveys_question_age.BETWEEN_55_64,
 				value: "55-64"
 			},
 			{
 				key: scopic.consts.surveys_question_age.MORE_65,
 				value: "65+"
 			}
 		]);

  		var _likelihood= Object.freeze([
  			{
  				key: "Choose_option",
  				value: "Choose option"
  			},
 			{
 				key: scopic.consts.surveys_question_likelihood.VERY_UNLIKELY,
 				value: "1 - VERY UNLIKELY"
 			},
 			{
 				key: scopic.consts.surveys_question_likelihood.UNLIKELY,
 				value: "2 - UNLIKELY"
 			},
 			{
 				key: scopic.consts.surveys_question_likelihood.REGULAR,
 				value: "3 - REGULAR"
 			},
 			{
 				key: scopic.consts.surveys_question_likelihood.LIKELY,
 				value: "4 - LIKELY"
 			},
 			{
 				key: scopic.consts.surveys_question_likelihood.VERY_LIKELY,
 				value: "5 - VERY LIKELY"
 			}
 		]);

		var _getSurveysList = function () {
			var defer = $q.defer();
			var credentials = { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token, event_id: $stateParams.eventId }
			, actions = { 
			  success: function (items) {
			                defer.resolve(items)
			            }
			   , error: function (event_error) {
			              defer.reject(event_error)
			      }
			  }

			Surveys.all(credentials, actions)
			return defer.promise;
		}

		var _createSurvey = function (survey) {
			//console.log(survey.surveys_answers_attributes[10].answer);
			var defer = $q.defer();
			var credentials = { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token, event_id: $stateParams.eventId }
			, actions = { 
			  success: function (items) {
			  				alert("success");
			  				console.log(items);
			                defer.resolve(items)
			            }
			   , error: function (event_error) {
			   				alert("error");
			              defer.reject(event_error)
			      }
			  }

			Surveys.create(credentials, actions, survey)
			return defer.promise;
		} 

        return {
        	genders: _genders,
        	races: _races,
        	ages: _ages,
        	likehood: _likelihood,
        	getSurveysList: _getSurveysList,
        	createSurvey: _createSurvey
        }

    }]);