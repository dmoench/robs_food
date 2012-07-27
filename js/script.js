$(document).ready(function(){
	// Grab json for easy manipulation
	var json_string = $('#json_data').text();
	var json = JSON.parse(json_string);

	/*---------------------------------------------------------------------------*\
		Google Maps
	\*---------------------------------------------------------------------------*/

	// Detect browser and set map to 100% if mobile
	var useragent = navigator.userAgent;
	var mapdiv = document.getElementById("map_canvas");

	if (useragent.indexOf('iPhone') != -1 || useragent.indexOf('Android') != -1 ) {
	  mapdiv.style.width = '100%';
	  mapdiv.style.height = '100%';
	} 
	
	// Initialize the map
	var mapOptions = {
	  center: new google.maps.LatLng(40.714997,-73.897133),
	  zoom: 12,
	  mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	var map = new google.maps.Map(document.getElementById("map_canvas"),
	    mapOptions);
	
	// Place all markers on map
	for(var i = 0; i < json.place.length; i++) {
		addressToMarker(json.place[i], map, addMarker);
	}

});

/*
	Accepts a string address and places it as a marker on the map
	@param place: A place object from the places json
	@param map: Reference to map object
	@param callback - call the addMarker function
*/
function addressToMarker(place, map, callback) {
	var geocoder;
	var latlng;
	geocoder = new google.maps.Geocoder();
	geocoder.geocode({'address': place.address }, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			latlng = results[0].geometry.location;
			callback(latlng, map, place);
		} else {
			alert("Geocode was not successful for the following reason: " + status);
		}
	});
}

/* 
	Places marker on the map and sets info window overlays
	@param latlng: LatLng position object
	@param map: Reference to map object
	@param place: A place object from the places json
*/
function addMarker(latlng, map, place) {
	var marker = new google.maps.Marker({
		position: latlng,
		map: map,
		title: place.name
	});
	
	// Create info window html
	var info_html = '<div id="place_' + place.id + '">' +
		'<p>Place: ' + place.name + '</p>' +
		'<p>Signature Dish: ' + place.sig_dish.title + '</p>' +
		'</div>';
		
	// Create InfoWindow object
	var info_window = new google.maps.InfoWindow({
		content: info_html
	});
	
	// Assign InfoWindow animations to marker
	google.maps.event.addListener(marker, 'mouseover', function(){
		info_window.open(map, marker);
	});
	google.maps.event.addListener(marker, 'mouseout', function(){
		info_window.close(map, marker);
	});
}