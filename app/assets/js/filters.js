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
  })

.filter('validatePermissions', function() {
  return function(array) {
    if (array == null) {
      return [];
    }
    
    var filteredMembers = [];
    for (var i = 0; i < array.length; i++) {
      if (array[i].visible !== false) {
        filteredMembers.push(array[i]);
      }
    }

    return filteredMembers;
  };
})

.filter('timeago', function () {
    //time: the time
    //local: compared to what time? default: now
    //raw: wheter you want in a format of "5 minutes ago", or "5 minutes"
    return function (time, local, raw) {
        if (!time) return "never";

        if (!local) {
            (local = Date.now())
        }

        if (angular.isDate(time)) {
            time = time.getTime();
        } else if (typeof time === "string") {
            time = new Date(time).getTime();
        }

        if (angular.isDate(local)) {
            local = local.getTime();
        }else if (typeof local === "string") {
            local = new Date(local).getTime();
        }

        if (typeof time !== 'number' || typeof local !== 'number') {
            return;
        }

        var
            offset = Math.abs((local - time) / 1000)
          , span = []
          , MINUTE = 60
          , HOUR = 3600
          , DAY = 86400
          , WEEK = 604800
          , MONTH = 2629744
          , YEAR = 31556926
          , DECADE = 315569260

        if (offset <= MINUTE)              span = [ '', raw ? 'now' : 'less than a minute' ];
        else if (offset < (MINUTE * 60))   span = [ Math.round(Math.abs(offset / MINUTE)), 'min' ];
        else if (offset < (HOUR * 24))     span = [ Math.round(Math.abs(offset / HOUR)), 'hour' ];
        else if (offset < (DAY * 7))       span = [ Math.round(Math.abs(offset / DAY)), 'day' ];
        else if (offset < (WEEK * 52))     span = [ Math.round(Math.abs(offset / WEEK)), 'week' ];
        else if (offset < (YEAR * 10))     span = [ Math.round(Math.abs(offset / YEAR)), 'year' ];
        else if (offset < (DECADE * 100))  span = [ Math.round(Math.abs(offset / DECADE)), 'decade' ];
        else                               span = [ '', 'a long time' ];

        span[1] += (span[0] === 0 || span[0] > 1) ? 's' : '';
        span = span.join(' ');

        if (raw === true) {
            return span;
        }
        return (time <= local) ? span + ' ago' : 'in ' + span;
    }
})

.filter('eventDate', function () {
    return function (time) {
        if (!time) return ''

        if (angular.isDate(time)) {
            time = time.getTime();
        } else if (typeof time === "string") {
            time = new Date(time)
        }

        var
            result = ''
          , local = new Date()
          , tomorrow = new Date(local.getTime() + 24 * 60 * 60 * 1000)
          , months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
          , days = ['SUNDAY','MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY']

        if (time.getDate() === local.getDate() && time.getMonth() === local.getMonth() && time.getFullYear() === local.getFullYear()) {
          result = 'TODAY';
        } else if (time.getDate() === tomorrow.getDate() && time.getMonth() === tomorrow.getMonth() && time.getFullYear() === tomorrow.getFullYear()) {
          result = 'TOMORROW';
        }  
        else {
          result = days[ time.getDay() ] + ', ' + months[time.getMonth()] + ' ' + time.getDate() + ' ' + time.getFullYear();
        }

        return result
    }
})

/*
 * groupBy
 *
 * Define when a group break occurs in a list of items
 *
 * @param {array}  the list of items
 * @param {String} then name of the field in the item from the list to group by
 * @returns {array} the list of items with an added field name named with "_new"
 *          appended to the group by field name
 *
 * @example   <div ng-repeat="item in MyList  | groupBy:'groupfield'" >
 *        <h2 ng-if="item.groupfield_CHANGED">{{item.groupfield}}</h2>
 *
 *        Typically you'll want to include Angular's orderBy filter first
 */
.filter('groupBy', function(){
    return function(list, group_by) {

    var 
        filtered = []
      , prev_item = null
      , group_changed = false
    // this is a new field which is added to each item where we append "_CHANGED"
    // to indicate a field change in the list
      , firstOfGroup = group_by + '_CHANGED'
      , lastOfGroup = group_by + '_LAST_OF_GROUP';

    // loop through each item in the list
    angular.forEach(list, function(item) {

      group_changed = false

      // if not the first item
      if (prev_item !== null) {

        // check if the group by field changed
        if (prev_item[group_by] !== item[group_by]) {
          group_changed = true
        }

      // otherwise we have the first item in the list which is new
      } else {
        group_changed = true
      }

      // if the group changed, then add a new field to the item
      // to indicate this
      if (group_changed) {
        item[firstOfGroup] = true;
        if (prev_item !== null) {
          prev_item[lastOfGroup] = true;
        }
      } else {
        item[firstOfGroup] = false;
      }

      filtered.push(item)
      prev_item = item

    });
    if (filtered.length > 0) {
      filtered[filtered.length - 1].lastOfGroup = true;
    }

    return filtered
    }
  })

.filter('limitWords', function() {
    return function(input, length) {
      if (!input) {
        return;
      }
      
      if (length === null) {
        return input;
      } 

      var words = input.split(' ');
      var sliceLength = words.length < length ? words.length : length;
      var slicedWords = words.slice(0, sliceLength);
      return slicedWords.join(' ');
    };
})

.filter('allowedNotifications', ['UserService', function(UserService) {
  var neededPermissionsMap = {
      event_recaps_due: ['events'],
      event_recaps_late: ['events'],
      event_recaps_pending: ['events'],
      event_recaps_rejected: ['events'],
      new_event: ['events', 'events_show']
    };

  function notificationShouldBeShown(notification) {
    if (neededPermissionsMap[notification.type] == null) {  //We are still not handling the event type with permissions
      return true;
    } else {
      var neededPermissions = neededPermissionsMap[notification.type];
      var showNotification = true;
      for (var i = 0; i < neededPermissions.length; i++) {
        showNotification = UserService.permissionIsValid(neededPermissions[i]);
        if (!showNotification) {
          break;
        }
      }
      return showNotification;
    }
  }
  return function (notifications) {
    if (notifications == null) {
      return;
    }

    var filteredNotifications = [];
    for (var i = 0; i < notifications.length; i++) {
      if (notificationShouldBeShown(notifications[i])) {
        filteredNotifications.push(notifications[i]);
      }
    }

    return filteredNotifications;
  };
}]);
