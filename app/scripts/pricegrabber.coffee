PriceGrabber =
  apiUrl: './api.php'

  sendRequest: (keyword) ->
    $.get @apiUrl + '?q=' + keyword

  getProduct: (keyword) ->
    # @sendRequest(keyword)
    $.get('data.xml')
        .done (data, textStatus, jqXHR) ->
            $.parseXML jqXHR.responseXML

  buildHTML: (productXML) ->

window.PriceGrabber = PriceGrabber
