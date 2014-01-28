/**
 * Debounce service to limit API calls, especially around search fields
 */
angular.module('brandscopicApp.debounce', []).
    factory('debounce', ['$timeout', '$q', function ($timeout, $q) {
        'use strict';

        /**
         * @param func {Function} to be debounced - required
         * @param delay {Number} Time in milliseconds to delay function execution - optional (defaults to 300)
         * @param immediate {Boolean} Whether the method should be immediately run - optional (otherwise false)
         * @param ctx {*} Context supplied within which the function should be called - optional i.e. this
         * @returns {Promise}
         */
        var deb = function (func, delay, immediate, ctx) {
            var timer = null,
                deferred = $q.defer(),
                wait = delay || 300;
            return function () {
                var context = ctx || this,
                    args = arguments,
                    callNow = immediate && !timer,
                    later = function () {
                        if (!immediate) {
                            deferred.resolve(func.apply(context, args));
                            deferred = $q.defer();
                        }
                    };
                if (timer) {
                    $timeout.cancel(timer);
                }
                timer = $timeout(later, wait);
                if (callNow) {
                    deferred.resolve(func.apply(context, args));
                    deferred = $q.defer();
                }
                return deferred.promise;
            };
        };

        return deb;
    }]);
