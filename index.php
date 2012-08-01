<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<title>Rob's Food Map</title>
	<meta name="description" content="Awesome new york food for under $8">
	<meta name="viewport" content="initial-scale=1.0, user-scalable=no" />
	<link rel="stylesheet" href="css/reset.css">
	<link rel="stylesheet" href="css/style.css">
	<link href='http://fonts.googleapis.com/css?family=Karla' rel='stylesheet' type='text/css'>
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>
	<script	
		src="http://maps.googleapis.com/maps/api/js?key=AIzaSyAqjzUu7XU2Z8NR1YC9tyv6EyYY7j0y6Ps&sensor=false">
	</script>
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
		<h1>NYC Food &lt $8</h1>
	</header>

	<div id="map_canvas"></div>
	<div id="faux-select-wrapper">
		<div id="faux-select">Select A Place</div>
		<div id="menu">
			<ul>
				<li id="everything">Show All</li>
				<?php for($i = 0; $i < count($xml_data->place); $i++): ?>
				<li id="<?php echo $xml_data->place[$i]->id; ?>">
					<?php echo $xml_data->place[$i]->name . ' (' . 
							$xml_data->place[$i]->type . ')'; ?>
				</li>
				<?php endfor; ?>
			</ul>
		</div>
	</div>
	
	<div id="info_block">
		<div class="content">
			<p>Nothing Selected</p>
		</div>
	</div>
	
	<div id="json_data"><?php echo $json; ?></div>
	
	<footer></footer>

 	<!-- JavaScript at the bottom for fast page loading -->
	<script src="js/script.js"></script>
</body>
</html>