<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<title>Rob's Food Map</title>
	<meta name="description" content="Awesome new york food for under $8">
	<meta name="viewport" content="width=device-width">
	<link rel="stylesheet" href="css/style.css">
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>
</head>

<body>
	<?php
		// XML > PHP Object > JSON Object
		$xml_string = file_get_contents('places.xml');
		$xml_string = str_replace(array("\n", "\r", "\t"), '', $xml_string);
		$xml_string = trim(str_replace('"', "'", $xml_string));
		$xml_data = simplexml_load_string($xml_string);
		$json = json_encode($xml_data);
	?>
	
	<header>
		<h1>Rob's NYC Food Map</h1>
	</header>

	<div id="map_canvas"></div>

	<div id="json_data"><?php echo $json; ?></div>
	
	<footer></footer>

 	<!-- JavaScript at the bottom for fast page loading -->
	<script src="js/script.js"></script>
</body>
</html>
