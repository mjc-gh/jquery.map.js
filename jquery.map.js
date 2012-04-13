(function($){
	var chart_api_url = location.protocol +"//chart.googleapis.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|";
	var colors = $.gmapColors = {
		blue: '6C97FF', green: '01C000', organge: 'FD8E08', 
		yellow: 'FEEC5A', purple: 'C296F1', brown: 'CA9B7D'
	};
	
  // latlng alias for future use
	var LatLng;
	
  function is_google_latlng(obj){
		if (typeof obj.lat == 'function')
			return true;
		  
		return false;
	};
  
	function get_map_data(elem){
		var data = elem.data('gmap');
		if (!data)
			$.error('Map is not initialized');
			
		return data;
	}
	
	function gmap_error(){
		$.error('Map is not initialized.');
	}
	
	function create_latlng(arg,lng){
		LatLng = LatLng || google.maps.LatLng;
		
		return lng ? new LatLng(arg, lng) : arg.length ?
			new LatLng(arg[0], arg[1]) : new LatLng(arg.lat, arg.lng);
	}
	
	function create_icon(color){
		return new google.maps.MarkerImage(chart_api_url + (colors[color] || color));
	}
	
	
	function positions_to_lat_lng(obj){
		var props = Array.prototype.slice.call(arguments, 1);
		for (var i = 0, prop; prop = props[i]; i++){
			if (obj[prop] && !is_google_latlng(obj[prop]))
				obj[prop] = create_latlng(obj[prop]);
		}
	}
	
	function remove_marker(markers, id){
		if (markers[id]){
			google.maps.event.clearInstanceListeners(markers[id]);
			markers[id].setMap(null);
			
			delete markers[id];
		}
	}
	
	function create_marker(elem, map, id, opts){
		if (opts.color){
			opts.icon = create_icon(opts.color);
		}
		
		var options = { map:map, zIndex:1 };
		jQuery.extend(options, opts);
		
		positions_to_lat_lng(options, 'position');
		var marker = new google.maps.Marker(options);
		
		google.maps.event.addListener(marker, 'click', function(ev){
			// trigger map marker click event
			elem.trigger('gmap.click', [id, marker]);
			
			if (opts.infoWindow){
				var info_window = new google.maps.InfoWindow();
				
				if (opts.infoWindow.content)
					info_window.setContent(opts.infoWindow.content);
				
				// so if we don't have content yet, google doesnt show the window
				// the window will be shown once content is set though (don't need to call open again)
				info_window.open(map, marker);
				
				// trigger info window open event passing the info window and opts
				// this makes it possible to modify the original options and add in content
				elem.trigger('gmap.open', [id, info_window, opts]);
			}
		});
		
		return marker;
	}
	
  var methods = {
		get:function(){
		  var data = $(this).data('gmap');
		  return data ? data.map : null;
		},
		
		init:function(opts){
		  return this.each(function(){
				var elem = $(this)
				var data = elem.data('gmap');
				
				if (!data) {
					var options = jQuery.extend({
						mapTypeId: google.maps.MapTypeId.ROADMAP,
						streetViewControl: false, zoom: 14
					}, opts);
					
					// convert center to google lat lng if needed
					positions_to_lat_lng(options, 'center');
					
					// if no center was provided
					if (!options.center)
						options.center = create_latlng(38.89, -77.02);
					
					// create map, bind events
					var map = new google.maps.Map(this, options);
				  google.maps.event.addListener(map, 'idle', function(){
						elem.trigger('gmap.idle', [map]);
				  });
					
				  // store data
				  elem.data('gmap', {map:map, options:options, markers:{}});
				}
		  });
		},
		
		add:function(id, options){
			return this.each(function(){
				var elem = $(this);
				var data = get_map_data(elem);
				
				data.markers[id] = create_marker(elem, data.map, id, options);
			});
		},
		
		remove:function(ids){
			if (!ids || !ids.length) return;
			
			return this.each(function(){
				var elem = $(this);
				var data = get_map_data(elem);
				
				if (typeof ids == 'string')
					ids = [ids];
				
				for (var i = 0, id; id = ids[i]; i++)
					remove_marker(data.markers, id);
				
			});
		},
				
		center:function(geo) {
			if (!geo) return;
			
			return this.each(function(){
				var elem = $(this);
				var data = get_map_data(elem);
				
				var center = is_google_latlng(geo) ? geo : create_latlng(geo);
				
				data.map.setCenter(center);
				data.options.center = center;
		  });
		},
		
		zoom:function(level){
			if (!level) return;
			
			return this.each(function(){
				var elem = $(this);
				var data = get_map_data(elem);
				
			  data.map.setZoom(level);
			  data.options.zoom = level;				  
		  });
		},
		
		search:function(str){
			var elem = $(this);
			var data = get_map_data(elem);
			
			var geocoder = new google.maps.Geocoder;
			var promise = $.Deferred();
			
			geocoder.geocode({ address: str }, function(results, status){
				var args = [results, status];
				
				if (status.match(/ok|zero/i))
					promise.resolveWith(promise, args);
				else
					promise.rejectWith(promise, args);
				
			});
			
			return promise;
		},
		
		markers:function(){
			var elem = $(this);
			var data = get_map_data(elem);
			
			return data.markers;
		}
	};
	
	$.gmapIcon = function(color){
		return create_icon(color);
	}
	
	$.fn.gmap = function(method){
		// Method calling logic
		if (!google || !google.maps) {
			$.error('No Google Maps Loaded; Cannot Initialize');
			
		} else if (!method) {
			return methods.get.apply(this); 

		} else if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
			
		} else if (typeof method == 'object') {
			return methods.init.apply(this, arguments);
			
		} else {
			$.error('Method ' +  method + ' does not exist on jQuery.gmap');
			
		}
	}
})(jQuery);
