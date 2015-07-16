(function() {
  $.fn.extend({
    PriceGrabber: function(options) {
      var container, decodeHtmlEntity, getProduct, getProductItems, getProductOffers, sendRequest, that;
      that = this;
      options = $.extend({
        api_url: '/pricegrabber/api.php',
        template: '<table class="table table-hover"> <tbody> {{#items}} <tr> <td><img src="{{ image }}"></td> <td><img src="{{ rating_image }}"></td> <td>{{ price }}</td> <td><a href="{{ url }}" target="_blank" class="btn btn-primary">Buy</a></td> </tr> {{/items}} </tbody> </table>'
      }, options);
      container = '<div class="' + that.attr('class') + '" id="' + that.attr('id') + '"></div>';
      decodeHtmlEntity = function(str) {
        return str.replace(/&#(\d+);/g, function(match, dec) {
          return String.fromCharCode(dec);
        });
      };
      sendRequest = function(keyword) {
        var output;
        keyword = decodeHtmlEntity(keyword);
        output = $(container).append('<span>Loading...</span>');
        container = $(output).insertAfter(that);
        return $.get(options.api_url + '?q=' + keyword);
      };
      getProductOffers = function(products) {
        var items;
        items = [];
        $.each(products, function(index, value) {
          var offers;
          offers = $(value).find('offer');
          return items = items.concat(getProductItems(offers));
        });
        return items;
      };
      getProductItems = function(products) {
        var items;
        items = [];
        $.each(products, function(index, value) {
          var image, price, rating_image, url;
          image = $(value).find('image_small').text() || $(value).find('retailer_logo').text();
          url = $($(value).find('url')[0]).text();
          price = $($(value).find('price')[0]).text();
          rating_image = $(value).find('rating_image').text();
          if (price !== '$') {
            return items.push({
              image: image,
              url: url,
              price: price,
              rating_image: rating_image
            });
          }
        });
        return items;
      };
      getProduct = function(keyword) {
        var template;
        template = options.template;
        return sendRequest(keyword).done(function(data, textStatus, jqXHR) {
          return $.parseXML(jqXHR.responseXML);
        }).done(function(doc) {
          var count_offers, items, output, products, xml;
          xml = $(doc);
          products = xml.find('product');
          count_offers = $(products).find('offer').length;
          items = count_offers > 0 ? getProductOffers(products) : getProductItems(products);
          Mustache.parse(template);
          output = Mustache.render(template, {
            items: items
          });
          return $(container).html(output);
        });
      };
      return getProduct(options.search);
    }
  });

}).call(this);
