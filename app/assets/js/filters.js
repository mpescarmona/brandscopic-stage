'use strict';

/* Filters */

angular.module('brandscopicApp.filters', [])
  .filter('interpolate', ['version', function(version) {
    return function(text) {
      return String(text).replace(/\%VERSION\%/mg, version);
    }
  }])

  .filter('totalCount', function() {
    return function(input) {
      if(input > 1000) {
        var result = (input / 1000).toFixed(1).toString() + "K";
        return result;
      }
      return input;
    }
  });