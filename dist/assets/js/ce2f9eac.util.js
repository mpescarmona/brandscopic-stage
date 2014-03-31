angular.module('util.jsonToFormData', [])

  .factory('jsonToFormDataFor', function() {
    return function (key_name, preserveInnerObjects){
      return function (data) {
        var paramsProcessor = function (properties, key){
          var params = []
          for (var prop in properties) {
            if (properties.hasOwnProperty(prop) && !(/^\$/).test(prop)) {
              var name  = key ? key + '['+ prop +']' : '['+ prop +']'
                , isObj =  properties[prop] instanceof Object  
                , value = isObj ? paramsProcessor(properties[prop]) : encodeURIComponent(properties[prop])

              params.push([encodeURIComponent(name), value].join( isObj ? '' : '='))
            }
          }
          console.log('params jtoF: ',params)
          return params.join('&')
        }

        for (attr in data){
         if (!preserveInnerObjects && data[attr] instanceof Object)
             delete data[attr]  
           }
       

          return String(data) !== '[object File]' ? paramsProcessor(data, key_name) : event;
      }
    }
  })
