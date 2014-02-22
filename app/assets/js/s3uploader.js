var uploadNow = (function () {
  var
    auth_token    = 'qdy6RGh_-HzH4DmD6aY6'
    , company_id  = 1
    , event_id    = undefined
    , url         = undefined
    , urlOnUpdate = undefined
    , injectOn    = 'event-gallery'

    , readIt = function (e) {
        var uri  = e.target.result
          , href = '#home/events/'+ event_id +'/photos/slider'

        render(uri, href)
    }
    , randomSegment = function (cant) {
        var cant = cant || 1
          , segments = ''
        for (var i=0; i < cant; i++) {
         segments += Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1)
        }
        return segments
    }
    , GUID = function(){
       return [ randomSegment(2), randomSegment(), randomSegment(), randomSegment(), randomSegment(3)  ].join('-')
    }
    , endUploading = function (e) {
        var parser  = new DOMParser()
         , response = parser.parseFromString(e.target.response, 'text/xml')
         , uri      = response.querySelector('Location').textContent

       angular.element('[ng-controller]:first').scope().trigger('createPhoto', { direct_upload_url: uri });
    }
    , render = function (uri, href) {
        angular.element('[ng-controller]:first').scope().trigger('createPhoto', { render: true, src: uri });

    }
    , callback = function (file) {
        return function (e) {
          var response = JSON.parse(e.target.response)
            , formData = new FormData()
            , xhr = new XMLHttpRequest()

          response.fields.key = [ 'uploads/', GUID(), '/', '${filename}'].join('')
          for (key in response.fields) {
            formData.append(key, response.fields[key])
          }

          formData.append('file', file)

          xhr.open('POST', response.url)
          xhr.onload = endUploading
          xhr.send(formData)
        }
    }
    , ApiParameters = function (file) {
        var request = new XMLHttpRequest()
          , params  = ['auth_token=' + auth_token, 'company_id=' + company_id ].join('&')

        request.open('GET', url + params)

        request.onload = callback(file)
        request.send()
    }
    , handleFileSelect = function (evt) {
        var file   = evt.target.files[0]
          , reader = new FileReader();
        if (file) {
          ApiParameters(file)
          reader.onload = readIt
          reader.readAsDataURL(file);
        }
    }
    , _bind = function (options) {
        var options = options || {}

        auth_token  = options.auth_token  || auth_token
        company_id  = options.company_id  || company_id
        event_id    = options.event_id    || event_id
        url         = options.url         || url
        urlOnUpdate = options.urlOnUpdate || urlOnUpdate
        input       = options.input       || 'input[type=file][data-aws]'
        injectOn    = options.injectOn    || injectOn

      console.log(auth_token, company_id, url, event_id)

      document.querySelector(input).addEventListener('change', handleFileSelect)
    }

    return {
      bind: _bind
    }

}())
