/**
 * Debounce service to limit API calls, especially around search fields
 */
angular.module('brandscopicApp.photosService', []).
    factory('photosService', ['$q', 'CompanyService', 'UserService', '$stateParams', 'Photos', function ($q, CompanyService, UserService, $stateParams, Photos) {
        'use strict';

          var _getPhotoAmazonAuth = function () {
              var
                defer = $q.defer()
              , credentials = { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token, event_id: $stateParams.eventId }
              , actions = {
                  success: function(response) {
                      defer.resolve(response)
                  }
               }
              Photos.form(credentials, actions)
              return defer.promise;
          }

          var _getPhotosList = function () {
              var
                defer = $q.defer()
              , credentials = { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token, event_id: $stateParams.eventId }
              , actions = {
                  success: function(response) {
                      defer.resolve(response)
                  }
               }
              Photos.all(credentials, actions)
              return defer.promise;
          }

          var _getAddPhoto = function () {
              var
                defer = $q.defer()
              , credentials = { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token, event_id: $stateParams.eventId }
              , actions = {
                  success: function(response) {
                      defer.resolve(response)
                  }
               }
              Photos.add(credentials, actions)
              return defer.promise;
          }

        return {
            getPhotoAmazonAuth: _getPhotoAmazonAuth,
            getPhotosList: _getPhotosList,
            getAddPhoto: _getAddPhoto
        }

    }])

  .service('UploadedPhotosTracker', function () {
    this.uploadedPhotos = {};
    
    this.addUploadedPhotos = function (eventId, amount) {
      if (!this.uploadedPhotos[eventId]) {
        this.uploadedPhotos[eventId] = 0;
      }
      this.uploadedPhotos[eventId] += amount;
    };

    this.getExpectedPhotosAmount = function (eventId) {
      return this.uploadedPhotos[eventId];
    };

    this.setUplodadedPhotos = function (eventId, amount) {
      this.uploadedPhotos[eventId] = amount;
    };
  });