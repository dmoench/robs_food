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
	  center: new google.maps.LatLng(40.715127,-74.005837),
	  zoom: 13,
	  mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	var map = new google.maps.Map(document.getElementById("map_canvas"),
	    mapOptions);
	
	addressToMarker(json.place[0].address, map, addMarker);

});

/*
	Accepts a string address and places it as a marker on the map
	@param address: String address
	@param map: Reference to a map object
	@param callback
*/
function addressToMarker(address, map, callback) {
	var geocoder;
	var latlng;
	geocoder = new google.maps.Geocoder();
	geocoder.geocode({'address': address}, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			latlng = results[0].geometry.location;
			callback(latlng, map);
		} else {
			alert("Geocode was not successful for the following reason: " + status);
		}
	});
}

/* Places marker on the map */
function addMarker(latlng, map) {
	var marker = new google.maps.Marker({
		position: latlng,
		map: map,
		title: 'BIG WONG'
	});
}