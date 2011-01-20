(function($){
  // is vlaid pt: if (center && center.lat && center.lng)
  var isGoogleLatLng = function(obj){
    if (typeof obj.lat == 'function')
      return true;
    return false;
  };
  
  var methods = {
    get:function(){
      var data = $(this).data('gmap');
      return data ? data.map : null;
    },
    init:function(opts){
      return this.each(function(){
        var $this = $(this)
        var data = $this.data('gmap');
        
        var center = opts.center;
        delete opts.center;
        
        if (!data) {
          var defaults = {
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            streetViewControl: false, zoom: 14,
            center: new google.maps.LatLng(38.89, -77.02) // center somewhere
          };
          var options = jQuery.extend(defaults, opts);
          var map = new google.maps.Map(this, options);
          
          if (center) {
            if (isGoogleLatLng(center))
              map.setCenter(center);
            else
              map.setCenter(new google.maps.LatLng(center.lat, center.lng));
          }
          
          google.maps.event.addListener(map, 'idle', function(){
            $this.trigger('gmap.idle', [map]);
          });
          
          $this.data('gmap', {map:map, options:options, markers:{}});
        }
      });
    },
    set:function(new_markers){
      return this.each(function(){
        var $this = $(this);
        var data = $this.data('gmap');
        
        if (data) {        
          // delete old markers if need be
          for (var id in data.markers) {
            var marker = data.markers[id];
            
            if (new_markers[id]) // marker already exists 
              delete new_markers[id];
            else { // marker needs to be deleted
              marker.setMap(null);
              delete data.markers[id];
            }
          }

          // create what needs to be created via jQuery#each   
          $.each(new_markers, function(id, opts){
            var geo = opts.position;
            delete opts.position;

            var options = {map: data.map, zIndex:1};
            jQuery.extend(options, opts);
            
            options.position = isGoogleLatLng(geo) ? geo : new google.maps.LatLng(geo.lat, geo.lng);
            data.markers[id] = new google.maps.Marker(options);

            google.maps.event.addListener(data.markers[id], 'click', function(ev){
              $this.trigger('gmap.click', [id, data]);
            });
          });
            
          // update stored data
          $this.data('gmap', data);
        } else $.error('Map is not initialized.');
      });
    },
    center:function(geo) {
      return this.each(function(){
        var $this = $(this);
        var data = $this.data('gmap');
        
        if (data) {
          var center = isGoogleLatLng(geo) ? geo : new google.maps.LatLng(geo.lat, geo.lng);
          data.map.setCenter(center);
          data.options.center = center;
          
          $this.data('gmap', data);
          
        } else $.error('Map is not initialized.');
      })
    },
    zoom:function(level){
      return this.each(function(){
        var $this = $(this);
        var data = $this.data('gmap');
        
        if (data) {
          data.map.setZoom(level);
          data.options.zoom = level;
          
          $this.data('gmap', data);
        } else $.error('Map is not initialized.');
        
      });
    }
  };
  
  $.fn.gmap = function(method){
    // Method calling logic
    if (!google || !google.maps) {
      $.error('No Google Maps Loaded; Cannot Initialize');
    } else if (!method) {
      return methods.get.apply(this); 
    } else if (methods[method]) {
      return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
    } else if (typeof method === 'object') {
      return methods.init.apply(this, arguments);
    } else {
      $.error('Method ' +  method + ' does not exist on jQuery.gmap');
    }    
  }
})(jQuery);
