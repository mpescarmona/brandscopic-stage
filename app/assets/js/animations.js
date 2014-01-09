'use strict';

/* Services */

angular.module('brandscopicApp.animations', [])

  .animation('.slide-animation', function () {
      return {
          addClass: function (element, className, done) {
              var scope = element.scope();

              if (className == 'ng-hide') {
                  var finishPoint = element.parent().width();
                  if(scope.direction !== 'right') {
                      finishPoint = -finishPoint;
                  }
                  TweenMax.to(element, 0.5, {left: finishPoint, onComplete: done });
              }
              else {
                  done();
              }
          },
          removeClass: function (element, className, done) {
              var scope = element.scope();

              if (className == 'ng-hide') {
                  element.removeClass('ng-hide');

                  var startPoint = element.parent().width();
                  if(scope.direction === 'right') {
                      startPoint = -startPoint;
                  }

                  TweenMax.set(element, { left: startPoint });
                  TweenMax.to(element, 0.5, {left: 0, onComplete: done });
              }
              else {
                  done();
              }
          }
      };
  });
