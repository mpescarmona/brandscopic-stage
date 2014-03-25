'use strict';

/* Directives */

angular.module('brandscopicApp.directives', ['brandscopicApp.services'])
  .directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  }])

  .directive('passwordValidate', function() {
    return {
      require: 'ngModel',
      link: function(scope, elm, attrs, ctrl) {
        ctrl.$parsers.unshift(function(viewValue) {

          scope.pwdValidLength = (viewValue && viewValue.length >= 8 ? 'valid' : undefined);
          scope.pwdHasLetter = (viewValue && /[A-z]/.test(viewValue)) ? 'valid' : undefined;
          scope.pwdHasNumber = (viewValue && /\d/.test(viewValue)) ? 'valid' : undefined;

          if(scope.pwdValidLength && scope.pwdHasLetter && scope.pwdHasNumber) {
            ctrl.$setValidity('pwd', true);
            return viewValue;
          } else {
            ctrl.$setValidity('pwd', false);
            return undefined;
          }

        });
      }
    };
  })

  //goTo is used in list of elements to see item details

  .directive('goTo', function ($window) {
    return {
      restrict: 'A',
      link: function (scope, _el, _attrs) {
        scope.goTo = function(path){
          $window.location.href = path;
        }
      }
    }
  })

  //stop propagation from stackoverflow.com/questions/14544741/angularjs-directive-to-stoppropagation

  .directive('stopEvent', function () {
    return {
      restrict: 'A',
      link: function (_scope, $el, attr) {
        $el.on(attr.stopEvent, function (e) {
          e.stopPropagation();
        });
      }
    };
  })

  .directive('headerSaveAction', function () {
    return {
      restrict: 'A',
      link: function (scope, $el, attr) {
        if(scope.$eval(attr.save)) {
          $el.on('click', function (e) {
            $('[data-trigger-on-header=save]').first().click()
          });
        } else {
          $el.on('click', function (e) {
            $('[data-trigger-on-header=edit]').first().click()
          });
        }
      }
    };
  })

  .directive('headerBackAction', ['$window', 'HistoryService', function ($window, HistoryService) {
    return {
      restrict: 'A',
      link: function (scope, $el, attr) {
        $el.on('click', function (e) {
          HistoryService.goBack();
          //scope.goBack ? scope.goBack() : $window.history.back()
        });
      }
    };
  }])

  .directive('whenScrolled', function() {
      return function(scope, elm, attr) {
          var raw = elm[0];

          elm.bind('scroll', function() {
              if (raw.scrollTop + raw.offsetHeight >= raw.scrollHeight) {
                  scope.$apply(attr.whenScrolled);
              }
          });
      };
  })

  .directive('redirectTo', function ($window) {
    return function (scope, el, attrs, ctrl) {
      el.on('click', function (e) {
        $window.location.href = this.getAttribute('redirect-to')
      })
    }
  })

  .directive('redirectToState', function ($state) {
    return function (scope, el, attrs, ctrl) {
      el.on('click', function (e) {
        // $window.location.href = this.getAttribute('redirect-to')
        $state.go(this.getAttribute('redirect-to-state'))
      })
    }
  })

  // .directive('windowResizeThingy', function($window) {
  //  return {
  //    restrict: 'A',
  //    link: function(scope, elem, attr) {

  //      // make sure this doesn't get applied twice.
  //      if($window.windowResizeThingyApplied) return;
  //      $window.windowResizeThingyApplied = true;

  //       // hide the url bar
  //       var page = elem[0],
  //         ua = $window.navigator.userAgent,
  //         iphone = ~ua.indexOf('iPhone') || ~ua.indexOf('iPod'),
  //         ipad = ~ua.indexOf('iPad'),
  //         ios = iphone || ipad,
  //         // Detect if this is running as a fullscreen app from the homescreen
  //         fullscreen = $window.navigator.standalone,
  //         android = ~ua.indexOf('Android'),
  //         lastWidth = 0;

  //       if (android) {
  //           // Android's browser adds the scroll position to the innerHeight.
  //           // Thus, once we are scrolled, the page height value needs to be corrected in case the     page is loaded
  //           // when already scrolled down. The pageYOffset is of no use, since it always
  //           // returns 0 while the address bar is displayed.
  //           window.onscroll = function () {
  //               page.style.height = window.innerHeight + 'px'
  //           }
  //       }
  //       var setupScroll = $window.onload = function () {
  //           // Start out by adding the height of the location bar to the width, so that
  //           // we can scroll past it
  //           if (ios) {
  //               // iOS reliably returns the innerWindow size for documentElement.clientHeight
  //               // but window.innerHeight is sometimes the wrong value after rotating
  //               // the orientation
  //               var height = document.documentElement.clientHeight;
  //               // Only add extra padding to the height on iphone / ipod, since the ipad
  //               // browser doesn't scroll off the location bar.
  //               if (iphone && !fullscreen) height += 60;
  //               page.style.height = height + 'px';
  //           } else if (android) {
  //               // The stock Android browser has a location bar height of 56 pixels, but
  //               // this very likely could be broken in other Android browsers.
  //               page.style.height = (window.innerHeight + 56) + 'px'
  //           }
  //           // Scroll after a timeout, since iOS will scroll to the top of the page
  //           // after it fires the onload event
  //           setTimeout(scrollTo, 0, 0, 1);
  //       };
  //       ($window.onresize = function () {
  //           var pageWidth = page.offsetWidth;
  //           // Android doesn't support orientation change, so check for when the width
  //           // changes to figure out when the orientation changes
  //           if (lastWidth == pageWidth) return;
  //           lastWidth = pageWidth;
  //           setupScroll();
  //       })();
  //    }
  //  };
  // })
  .directive('inputReset', function(){
    return function(scope, el, attr){
      el.on('keyup', function(e){
        var isEmpty = ! this.querySelector('input').value.length
        if( this.querySelector('a') != null) {
            this.querySelector('a').className = isEmpty ?  'type-reset hidden' : 'type-reset';
        }
      })
      el.on('keydown', function(e){
        if (e.keyCode == 27) {
          this.querySelector('a').className = 'type-reset hidden'
          this.querySelector('input').value = ''
        }
      })
      el.find('a').on('click', function(e){
        e.preventDefault()
        this.className = 'type-reset hidden'
        this.parentElement.querySelector('input').value = ''
      })
      el.find('input').on('change', function(e){
        var isEmpty = ! this.value.length
        if(this.parentElement.querySelector('a') != null) {
          this.parentElement.querySelector('a').className = isEmpty ?  'type-reset hidden' : 'type-reset';
        }
      })

    };
  })
  .directive('needsPermissions', ['UserService', '$injector', '$state', '$timeout', function(UserService, $injector, $state, $timeout){
    return {
      restrict: 'AE',
      link: function(scope, element, attrs) {
        function handlePermissions(permissions, permissionsHandler) {
          if (permissions instanceof Array) {
            for (var i = 0; i < permissions.length; i++) {
              var permission = permissions[i];
              permissionsHandler(permission);
            }
          }
          else if (permissions !== null && typeof permissions === 'object') {
            for (var key in permissions) {
              permissionsHandler(key, permissions[key]);
            }
          }
        }

        function doWork() {
          console.log('Permissions directive executed');
          var permissionsServiceName = attrs.provider;
          if (permissionsServiceName == null) {
            throw 'The permissions directive lacks a provider';
          }
          
          var permissionsService = $injector.get(permissionsServiceName);
          if (permissionsService == null) {
            throw 'The permissions provider could not be found';
          }

          handlePermissions(permissionsService.pagePermissions, function(permission) {
            if (!UserService.permissionIsValid(permission)) {
              $state.go('home.forbidden');
              return;
            }
          });

          handlePermissions(permissionsService.elementsVisiblePermissions, function(key, permissions) {
            var elementsShouldBeVisible = true;
            if (permissions instanceof Array) {
              for (var i = 0; i < permissions.length; i++) {
                if (!UserService.permissionIsValid(permissions[i])) {
                  elementsShouldBeVisible = false;
                  break;
                }
              }
            } else {
              elementsShouldBeVisible = permissions.customHandler();
            }
            if (!elementsShouldBeVisible) {
              element.find(key).hide();
            }
          });

          handlePermissions(permissionsService.hyperlinksEnabledPermissions, function(key, permissions) {
            var elementsShouldBeLinkable = true;
            if (permissions instanceof Array) {
              for (var i = 0; i < permissions.length; i++) {
                if (!UserService.permissionIsValid(permissions[i])) {
                  elementsShouldBeLinkable = false;
                  break;
                }
              }
            } else {  //In this case, we have a custom handler
              elementsShouldBeLinkable = permissions.customHandler();
            }


            if (!elementsShouldBeLinkable) {
              element.find(key).off();
            }
          });

          if (scope.customPermissionsHandler) {
            scope.customPermissionsHandler();
          }
        
        }

        //We need this in order to know what variables in the scope might change after load time 
        //probably because of an AJAX query, in order to apply the permissions on new items.
        if (scope.getObservableProperties) {
          var propertiesToWatch = scope.getObservableProperties();
          for (var i = 0; i < propertiesToWatch.length; i++) {
            scope.$watch(propertiesToWatch[i], function() {
              doWork();
            }, true);
          }
        }
        $timeout(function() {doWork();}, 0);
      }
    };
  }])

  .directive('showPhoto', function(){
    return function (scope, $el, attr) {
     $el.on('change', function (e) {
        var reader = new FileReader()
        reader.onload = function (e) {
          document.querySelector('.fileUpload img.show-preview').src = e.target.result
        }
        reader.readAsDataURL(e.target.files[0]);
      })
    }
  });
