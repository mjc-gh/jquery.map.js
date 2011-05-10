jQuery.map.js
=========


Overview
--------


This is a simple jQuery Google Maps API v3 wrapper. It provides map initialization as well as the methods to add a set of markers, center and zoom the map. You can also access the Google "map object" directly for more advanced usage.

[See Google's doc for more details](http://code.google.com/apis/maps/documentation/javascript/basics.html)

Please see the demo.html file for demos and code examples. 

_This plugin is used on [MyLatLng.com](http://mylatlng.com)._


Position Notes
--------------

Any method that takes a positional option can either be a google.maps.LatLng object or a custom object that looks like:

`var position = {lat:12.34, lng:56.78}`

This means you don't have to create new google.maps.LatLng and can rather pass objects like this to the respective methods (`init`, `center` and `set` methods) 


Methods
-------

* **init()**

	This is the initialization method. Options are actually Google Maps options. Refer to [Google for details on all the options](http://code.google.com/apis/maps/documentation/javascript/reference.html#MapOptions)

	Examples:

		$('#map-canvas').gmap('init', { 
			disableDefaultUI:true, 
			center: {lat:38.89, lng:-77.02},
			zoom: 18, 
		});


	Shortcut method:

		$('#map-canvas').gmap({ 
			disableDefaultUI:true, 
			center: {lat:38.89, lng:-77.02},
			zoom: 18
		});


* **set(markers)**
 
	Use this method to place a full set of markers on the map. The method accepts 1 argument which should be an object (associative array) mapping unique IDs to a marker object.  

	The bindable gmap.click event (see below) will pass this ID to the specified callback function.

	Refer to [Google for details on map markers](http://code.google.com/apis/maps/documentation/javascript/reference.html#Marker)

		var markers = {
			1234: {
				title: 'Marker #1'
				position: {lat:38.89, lng:-77.02},
				animation: google.maps.Animation.DROP
			},
			5678: {
				title: 'Marker #2'
				position: {lat:34.05, lng:-69.23},
				animation: google.maps.Animation.DROP
			}
		};

	`$('#map-canvas').gmap('set', markers);`

	This method is designed to set ALL of the markers on the given map. There is no 'update' feature for this method. If set is called more than once with identical marker IDs, the markers will not update. Rather, to "update" a marker call set with a new ID for that respective marker. Calling the `set` method with an empty object will clear all the markers.
  
	`$('#map-canvas').gmap('set', {});`

	This helps prevent the markers from flickering when a new set is added. It's possible to access the current markers object via the following:

	`$('#map-canvas').data('gmap').markers` 


* **center(position)**

	Center the map at a given position.

		$('#map-canvas').center({
	  	lat:38.89, lng:-77.02
		});


* **zoom(level)** 

	Set the map zoom level

	`$('#map-canvas').zoom(15);`



* **get()**

	Get the actual Google Maps object.

		var map = $('#map-canvas').get();
		console.debug( map.getCenter(), map.getBounds() );



Events 
------
	
This wrapper also provides access to two commonly used Google Maps events


* **gmap.idle** 
 
	The Google Maps 'idle' event which is "fired when the map becomes idle after panning or zooming. 

	The callback will be passed an event object and a [Google Map](http://code.google.com/apis/maps/documentation/javascript/reference.html#Map) object.

	Example: 

		$('#map-canvas').bind('gmap.idle', function(ev, map){
			// map is Google Maps object
			console.debug(map.getBounds());
		});


* **gmap.click**

	This event triggered when a Marker is clicked. 

	The callback will be passed an event object, a marker ID, and object with the following structure

		{ 
			map: <Google Maps object>, 
			markers: <Markers Set (from `set` method)>, 
			options: <Initial Map Options <from `init` method> 
		}


	Example: 

		$('#map-canvas').bind('gmap.click', function(ev, id, data) {
			console.debug(id, data);
			console.debug(data.map.getBounds());
		});

