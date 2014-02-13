var uploadNow = (function () {
  var
    auth_token   = 'qdy6RGh_-HzH4DmD6aY6'
    , company_id = 2
    , event_id   = 55
    , url        =  undefined
    , injectOn   = 'event-gallery'

    , readIt     = function (fileName) {
        return function (e) {
          var blob = e.target.result
      }
    }
    , randomSegment = function (cant) {
        var cant = cant || 1
          , segments = ''
        for(var i=0; i < cant; i++){
         segments += Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1)
        }
        return segments
    }
    , GUID = function(){
       return [ randomSegment(2), randomSegment(), randomSegment(), randomSegment(), randomSegment(3)  ].join('-')
    }
    , endUploading = function (e) {
        var parser   = new DOMParser()
         , response = parser.parseFromString(e.target.response, 'text/xml')
         , uri = response.querySelector('Location').textContent
         , li = document.createElement('li')
         , a = document.createElement('a')
         , img = document.createElement('img')
        
        a.href = '#home/events/'+ event_id +'/photos/slider'
        img.src = uri
        a.appendChild(img)
        li.appendChild(a)
        document.body.getElementById(injectOn).appendChild(li)
        console.log('result of upload: ', uri);
    }
    , callback = function (blob, fileName) {
        return function (e) {
          var response = JSON.parse(e.target.response)
            , formData = new FormData()
            , xhr = new XMLHttpRequest()

          response.fields.key = [ 'uploads/', GUID(), fileName ].join('')
          for (key in response.fields) {
            formData.append(key, response.fields[key])
          }

          formData.append('file', blob)

          xhr.open('POST', response.url)
          xhr.onload = endUploading
          xhr.send(formData)
        }
    }
    , readIt = function (fileName, fileType) {
        return function (e) {
          var binary = atob(e.target.result.split(',')[1])
            ,  array = []

          for (var i = 0; i < binary.length; i++) {
            array.push(binary.charCodeAt(i));
          }

          var blob = new Blob([new Uint8Array(array)], {type: fileType});

          ApiParameters(blob, fileName)
        }
    }
    , ApiParameters = function (blob, fileName) {
        var request = new XMLHttpRequest()
          , params  = ['auth_token=' + auth_token, 'company_id=' + company_id ].join('&')

        request.open('GET', url + params)

        request.onload = callback(blob, fileName)
        request.send()
    }
    , handleFileSelect = function (evt) {
        var file = evt.target.files[0]
        if (file){
          reader = new FileReader();
          reader.onload = readIt(file.name, file.type);
          reader.readAsDataURL(file);
        }


    }
    , _bind = function (options) {
        var options = options || {};
        auth_token = options.auth_token || auth_token
        company_id = options.company_id || company_id
        event_id   = options.event_id   || event_id
        url        = options.url        || url
        input      = options.input      || 'input[type=file][data-aws]'
        injectOn   = options.injectOn   || injectOn

      console.log(auth_token, company_id, url, event_id)
      document.querySelector(input).addEventListener('change', handleFileSelect)
    }

    return {
      bind: _bind
    }

}())
