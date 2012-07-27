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
			callback(latlng, map, place.name);
		} else {
			alert("Geocode was not successful for the following reason: " + status);
		}
	});
}

/* 
	Places marker on the map
	@param latlng: LatLng position object
	@param map: Reference to map object
	@param name: String
*/
function addMarker(latlng, map, name) {
	var marker = new google.maps.Marker({
		position: latlng,
		map: map,
		title: name
	});
	google.maps.event.addListener(marker, 'click', toggleBounce);
}

function toggleBounce() {

  if (marker.getAnimation() != null) {
    marker.setAnimation(null);
  } else {
    marker.setAnimation(google.maps.Animation.BOUNCE);
  }
}