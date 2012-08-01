var markers = new Array(); // Array to store marker references
var infoWindows = new Array(); // Array to store info windows

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

	if(useragent.indexOf('iPhone') != -1 || useragent.indexOf('Android') != -1 ) {
		mapdiv.style.width = '100%';
		mapdiv.style.height = '100%';
	} 
	
	// Initialize the map
	var mapOptions = {
		center: new google.maps.LatLng(40.714997,-73.897133),
		zoom: 11,
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
			stopAllBouncing();
			closeAllInfoWindows();
			
			// Reset map to show all
			map.panTo(new google.maps.LatLng(40.714997,-73.897133));
			map.setZoom(12);
			
			// Reset #faux-select and #info_block
			$('#info_block .content').html('<p>Nothing Selected</p>');
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

/*---------------------------------------------------------------------------*\
	Accepts a string address and places it as a marker on the map
	@param place: A place object from the places json
	@param map: Reference to map object
	@param callback - call the addMarker function
\*---------------------------------------------------------------------------*/
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

/*---------------------------------------------------------------------------*\ 
	Places marker on the map and sets info window overlays
	@param latlng: LatLng position object
	@param map: Reference to map object
	@param place: A place object from the places json
\*---------------------------------------------------------------------------*/
function addMarker(latlng, map, place) {
	// Instantiate marker
	var marker = new google.maps.Marker({
		position: latlng,
		map: map,
		title: place.name
	});
	
	// Add to markers array for later reference
	var marker_id = place.id;
	markers[marker_id] = marker;
	
	// Create info window html
	var info_html = '<div class="place-info-overlay"><h2>' + place.name + 
		'</h2><p class="type">' + place.type + '</p>' +
		'<p>' + place.sig_dish.title + '</p></div>';
		
	// Create InfoWindow object and store in array
	var info_window = new google.maps.InfoWindow({
		content: info_html,
		disableAutoPan: true
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
		var $menu = $('#menu');
		if($menu.hasClass('opened')) {
			$menu.hide();
			$menu.removeClass('opened');
		}
	});
}

/*---------------------------------------------------------------------------*\
	Updates the #info_block, #faux_select, and zooms the map in on the marker
	based on the passed in place object
	@param place: A place object
	@param map: The map
\*---------------------------------------------------------------------------*/
function updatePageView(place, map) {
	// Close #info_block
	$('#info_block').slideUp(300);
	
	// Update #faux-select
	$('#faux-select').html(place.name);
	
	// Update map
	stopAllBouncing();
	closeAllInfoWindows();
	var geocoder;
	geocoder = new google.maps.Geocoder();
	geocoder.geocode({'address': place.address }, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			var latlng = results[0].geometry.location;
			map.panTo(latlng);
			map.setZoom(15);
		} else {
			alert("Geocode was not successful for the following reason: " + status);
		}
	});
	markers[place.id].setAnimation(google.maps.Animation.BOUNCE);
	
	// Show infoWindow on map
	var info_html = '<div class="place-info-overlay"><h2>' + place.name + 
		'</h2><p>' + place.address + '</p></div>';
	var info_window = new google.maps.InfoWindow({ 
		content: info_html,
		disableAutoPan: true
	});
	info_window.open(map, markers[place.id]);
	infoWindows.push(info_window);
	
	// Update #info_block
	var info_html = 
		'<div class="left"><h3>' + place.sig_dish.title + ' - $' + place.sig_dish.price  +
		'</h3><p>' + place.sig_dish.desc + '</p>' +
		'</div>' +
		'<div class="right">' +
		'<div class="yelp_wrapper"><a href="' + place.yelp_link + '" target="_blank"></a></div>' +
		'<div class="type">' + place.type + '</div>' +
		'<p>' + place.address + '</p>' +
		'</div>';
	
	$('#info_block .content').html(info_html);
	$('#info_block').slideDown(300);
}

/*---------------------------------------------------------------------------*\
	Stops all markers in the global markers array from bouncing
\*---------------------------------------------------------------------------*/
function stopAllBouncing() {
	for(var i = 1; i < markers.length; i++) {
		markers[i].setAnimation(null);
	}
}

/*---------------------------------------------------------------------------*\
	Closes all info windows on the given map and clears the infoWindows array
\*---------------------------------------------------------------------------*/
function closeAllInfoWindows() {
	for(var i = 0; i < infoWindows.length; i++) {
		var info_window = infoWindows[i];
		console.log(info_window);
		info_window.close();
	}
	infoWindows.length = 0; // CLear the array out
}