(($) ->
  $.fn.extend
    PriceGrabber: (options) ->
      that = @
      options = $.extend {
        api_url: '/pricegrabber/api.php'
        template: '
          {{#items}}
          <table class="table table-hover">
              <tbody>
                {{#items}}
                <tr>
                  <td><span class="product-name">{{ product_name }}</span></td>
                  <td><img src="{{ rating_image }}"></td>
                  <td><span class="price">{{ price }}</span></td>
                  <td><a href="{{ url }}" target="_blank" class="btn btn-primary">Go to Store</a></td>
                </tr>
                {{/items}}
              </tbody>
            </table>
          {{/items}}
          {{^items}}
            <span>Sorry, no item found.</span>
          {{/items}}
        '
      }, options

      container = '<div class="' + that.attr('class') + '" id="' + that.attr('id') + '"></div>'

      decodeHtmlEntity = (str) -> str.replace /&#(\d+);/g, (match, dec) -> String.fromCharCode dec

      sendRequest = (keyword) ->
        keyword = decodeHtmlEntity keyword
        output = $(container).append '<span>Loading...</span>'
        container = $(output).insertAfter that

        $.get options.api_url + '?q=' + keyword

      getProductOffers = (products) ->
        items = []

        $.each products, (index, value) ->
          offers = $(value).find 'offer'
          image = $(value).find('image_small').text()
          product_name = $(value).find('title').text()
          items = items.concat getProductItems offers,
            image: image
            product_name: product_name
        items

      getProductItems = (products, item) ->
        items = []

        $.each products, (index, value) ->
          image = $(value).find('image_small').text() || $(value).find('retailer_logo').text() || (item && item.image)
          product_name = (item && item.product_name) || $(value).find('title').text()
          url = $($(value).find('url')[0]).text()
          price = $($(value).find('price')[0]).text()
          rating_image = $($(value).find('rating_image')[0]).text()

          if price != '$'
            items.push
              product_name: product_name
              image: image
              url: url
              price: price
              rating_image: rating_image

        items

      getProduct = (keyword) ->
        template = options.template

        sendRequest(keyword)
          .done (data, textStatus, jqXHR) -> $.parseXML jqXHR.responseXML
          .done (doc) ->
            xml = $(doc)
            products = xml.find('product')
            count_offers = $(products).find('offer').length

            items = if count_offers > 0 then getProductOffers products else getProductItems products

            # return $(container).remove() unless items.length

            Mustache.parse template
            output = Mustache.render template, items: items

            $(container).html output

      getProduct options.search
)(jQuery)
