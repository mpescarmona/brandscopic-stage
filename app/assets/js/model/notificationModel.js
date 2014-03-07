angular.module('model.notification', ['persistence.notification'])

.service('Notification',['notificationClient', function (notificationClient) {
	var
	    country_id
	  , collection
	  , all = function(credentials, actions) {
	  	  	if ('auth_token' in credentials && 'company_id' in credentials && 'success' in actions) {
	  	  		if (collection) {
	  	  			actions.success(collection);
	  	  		} else {
	  	  			notificationClient.all(credentials, allResponse(actions));
	  	  		}
	  	  	} else {
	  	  		throw 'Wrong set of credentials'
	  	  	}
		}
	  , allResponse = function(actions) {
          return function(resp){
            if (resp.length) {
              collection = resp

              actions.success(angular.copy(collection))
            }
            else
              throw 'results missing on response'

          }
      }
      , getNotificationClass = function(notification) {
      		if (notification.type.indexOf('late') != -1) {
      			return 'late';
      		} 
      		else if (notification.type.indexOf('comments') != -1) {
      			return 'approve';
      		} else if (notification.type === 'event_recaps_pending') {
      			return 'submitted';
      		} else {
      			return '';
      		}
        };
	return { 
		all: all,
		getNotificationClass : getNotificationClass
	};	
}]);