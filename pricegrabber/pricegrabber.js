(function(){$.fn.extend({PriceGrabber:function(a){var b,c,d,e,f,g;return g=this,a=$.extend({api_url:"./api.php",template:'<table class="table table-hover"> <tbody> {{#items}} <tr> <td><img src="{{ image }}"></td> <td>{{ price }}</td> <td><a href="{{ url }}" target="_blank" class="btn btn-primary">Buy</a></td> </tr> {{/items}} </tbody> </table>',use_retailer:!1},a),b='<div class="'+g.attr("class")+'" id="'+g.attr("id")+'"></div>',f=function(c){var d;return d=$(b).append("<span>Loading...</span>"),b=$(d).insertAfter(g),$.get(a.api_url+"?q="+c)},e=function(a){var b;return b=[],$.each(a,function(a,c){var d;return d=$(c).find("offer"),$.each(d,function(a,c){var d,e,f;return d=$(c).find("retailer_logo").text(),f=$(c).find("url").text(),e=$(c).find("price").text(),b.push({image:d,url:f,price:e})})}),b},d=function(a){var b;return b=[],$.each(a,function(a,c){var d,e,f;return d=$(c).find("image_small").text(),f=$(c).find("product > url").text(),e=$($(c).find("price")[0]).text(),b.push({image:d,url:f,price:e})}),b},(c=function(c){var g;return g=a.template,f(c).done(function(a,b,c){return $.parseXML(c.responseXML)}).done(function(c){var f,h,i,j;return j=$(c),i=j.find("product"),f=a.use_retailer?e(i):d(i),Mustache.parse(g),h=Mustache.render(g,{items:f}),$(b).html(h)})})(a.search)}})}).call(this);