<?php

	header('Content-type: text/html">html; charset=utf-8');
	mb_internal_encoding('UTF-8');
	$ch = curl_init();
	
	#Metodo Timbrar XML<<<--------------------
	$request_url = "https://dev.facturaloplus.com/api/rest/servicio/timbrar";
	$apikey = 'apikey';
 	$arc = file_get_contents('rsc/cfdi40_ejemplo_xml.xml');
	
	$fields = array(
	'apikey' => $apikey,
	'xmlCFDI' => $arc,
	);

	#FUNCION DE CURL PARA EL ENVIO DEL APIKEY, XML Y KEYPEM
	curl_setopt($ch, CURLOPT_URL, $request_url); 		
	curl_setopt($ch, CURLOPT_POST, true); 				
	echo curl_setopt($ch, CURLOPT_POSTFIELDS, $fields);	
	$res = curl_exec($ch);	
	curl_close($ch);		
	print_r($res); 			

?>
