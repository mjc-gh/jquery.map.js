jQuery.map.js v2
=============


Overview
--------


This is a simple jQuery Google Maps API v3 wrapper. It provides map initialization as well as the methods to add a set of markers, center and zoom the map. You can also access the Google "map object" directly for more advanced usage.

[See Google's doc for more details](http://code.google.com/apis/maps/documentation/javascript/basics.html)

Please see the demo.html file for demos and code examples. If you would like to see a feature or find a bug submit an issue. 

_This plugin is used on [MyLatLng.com](http://mylatlng.com)._


Position Notes
--------------

Any method that takes a positional option can either be a google.maps.LatLng object, an Array or an Object

    // array
    var position = [12.34, 56.78];
	
    // object
    var position = {lat:12.34, lng:56.78}

This means you don't have to create new google.maps.LatLng and can just pass objects or array to the various methods.


Documentation
-------------

This plugin had a complete rewrite in 2/12 and docs need to be written. Refer to the demo page for the time being.
