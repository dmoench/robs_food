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

	// Create a marker for each place
	var place_position = addressToLatLng(json.place[0].address, fofo);
	var marker = new google.maps.Marker({
			position: place_position,
			map: map,
			title: json.place[0].name
		});

});

/*
	Converts string address to LatLng object and return
	@param address: String address
	@return latlng: LatLng address
	TODO - deal with asynchronisity, returns latlng before the geocode function finishes
*/
function addressToLatLng(address, callback)
{
	var geocoder;
	var latlng;
	geocoder = new google.maps.Geocoder();
	geocoder.geocode({'address': address}, function(results, status)
	{
		if (status == google.maps.GeocoderStatus.OK) 
		{
			latlng = results[0].geometry.location;
		} else {
			alert("Geocode was not successful for the following reason: " + status);
		}
	});
	callback(latlng);
	return latlng;
}

function fofo(data) {
	alert(data);
}