angular.module('util.jsonToFormData', [])

  .factory('jsonToFormDataFor', function(){
    return function (key_name){
      return function (data) {
        var paramsProcessor = function (properties, key){
          var params = []
          for (var prop in properties) {
            if (properties.hasOwnProperty(prop) && !(/^\$/).test(prop)) {
              var name  = key + '['+ prop +']'
              , value = properties[prop]
              params.push([encodeURIComponent(name), encodeURIComponent(value)].join('='))
            }
          }
          return params.join('&')
        }

        for(attr in data)
          if (data[attr] instanceof Object) delete data[attr]

            return String(data) !== '[object File]' ? paramsProcessor(data, key_name) : event;
      }
} })