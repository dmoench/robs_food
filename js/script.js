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
	var map = new google.maps.Map( document.getElementById("map_canvas"), mapOptions);
	
	// Place all markers on map
	for(var i = 0; i < json.place.length; i++) {
		addressToMarker(json.place[i], map, addMarker);
	}
	
	/*---------------------------------------------------------------------------*\
		Dropdown Menu
	\*---------------------------------------------------------------------------*/
	// Show toggle place menu visibility
	$('#faux-select').click( function() { 
		var $menu = $('#menu');
		if(!$menu.hasClass('opened')) {
			$menu.show();
			$menu.addClass('opened'); 
		} else {
			$menu.hide();
			$menu.removeClass('opened');
		}
		
	});
	
	$('#menu ul li').click( function() {
		if($(this).attr('id') == 'everything') {
			// Reset map to show all
			map.panTo(new google.maps.LatLng(40.714997,-73.897133));
			map.setZoom(12);
			
			// Reset #faux-select and #info_block
			$('#info_block').html('<p>Nothing Selected</p>');
			$('#faux-select').html('Select A Place');
			
			// Hide info_block
			$('#info_block').slideUp(300);
			
		} else {
			// Grab place id
			var place_id = $(this).attr('id') - 1;
		
			updatePageView(json.place[place_id], map);
		}
		// Hide menu
		$('#menu').hide();
		$('#menu').removeClass('opened');
	});

}); // End document ready function

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
	var info_html = '<div class="place-info-overlay' + place.id + '">' +
		'<h2>' + place.name + '</h2>' +
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
	
	// Add updateInfoBlock() to marker clicks
	google.maps.event.addListener(marker, 'click', function(){
		updatePageView(place, map);
	});
}

/*
	Updates the #info_block, #faux_select, and zooms the map in on the marker
	based on the passed in place object
	@param place: A place object
	@param map: The map
*/
function updatePageView(place, map) {
	// Close #info_block
	$('#info_block').slideUp(300);
	
	// Update #faux-select
	$('#faux-select').html(place.name);
	
	// Update map
	var geocoder;
	geocoder = new google.maps.Geocoder();
	geocoder.geocode({'address': place.address }, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			var latlng = results[0].geometry.location;
			map.panTo(latlng);
			map.setZoom(17);
		} else {
			alert("Geocode was not successful for the following reason: " + status);
		}
	});
	
	// Update #info_block
	var info_html = 
		'<p>Food Type: ' + place.type + '</p>' +
		'<p>Signature Dish: ' + place.sig_dish.title + 
		' ($' + place.sig_dish.price + ')' + '</p>';
	$('#info_block').html(info_html);
	$('#info_block').slideDown(300);
	
	// Todo set marker animation to BOUNCE. Will involve passing the marker to the method,
	// which will involve finding out how to access the available markers based on knowing
	// the place object
}