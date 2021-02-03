<?php

ini_set('display_errors', 'on');
error_reporting(E_ALL);

$output['status']['code'] = "200";
$output['status']['name'] = "ok"; 
header('Content-Type: application/json; charset=UTF-8');


require 'data/geonames.php';
require 'data/countryBorders.php';
require 'data/openCage.php';
require 'data/worldCities.php';
require 'data/exchangeRates.php';
require 'data/weather.php';
require 'data/poi.php';
require 'data/newsProviders.php';

if (isset ($_REQUEST['homeCoords'])) {
    //openCage reverse
    $output['homeCountryName'] = getCountryName($_REQUEST['homeCoords']);
} else {

if (isset($_REQUEST['code'])) {$iso2=  $_REQUEST['code'];} else { $iso2 = null;}
if (isset($_REQUEST['countryName'])) {$countryName= $_REQUEST['countryName'] ;} else { $countryName = null; }


//openCage
$output['coords'] = getCountryCoords($countryName);

$lat= $output['coords']['lat'] ;
$lng= $output['coords']['lng'] ;

//countryBorders
$output['countryBorders'] = getCountryBorders($countryName);
$output['countryList'] = getCountryList();

$isoa2 = $output['countryBorders']['properties']['iso_a2'];

//geonames
$output['countryInfo'] = countryInfo($isoa2);
$currencyCode = $output['countryInfo'][0]['currencyCode'];
$output['wiki'] = wikiSearch($countryName);

$output['cities'] = getCities($countryName);

//exchange rates
$output['exchangeRates'] = exchangeRates($currencyCode);

//open weather map
$output['weather'] = getWeather($countryName);

//points of interest
$minLat = $lat;
$minLng = $lng;
$maxLat = $lat;
$maxLng = $lng;

$borders = $output['countryBorders']['geometry']['coordinates'];


foreach($borders as $segment) {

    foreach ($segment[0] as $coord ) {
        if($coord[1] < $minLat) { $minLat = $coord[1]; }
        if($coord[0] < $minLng) { $minLng = $coord[0]; }
        if($coord[1] > $maxLat) { $maxLat = $coord[1]; }
        if($coord[0] > $maxLng) { $maxLng = $coord[0]; }
       
       };

}


$output['poi'] = getPoi($maxLat,$maxLng,$minLat,$minLng);
$output['railStations'] = getRailStations($maxLat,$maxLng,$minLat,$minLng);
$output['hotels'] = getHotels($maxLat,$maxLng,$minLat,$minLng);
$output['touristSpots'] = getTourist($maxLat,$maxLng,$minLat,$minLng);



//news api

$output['newsProviders'] = getNewsProviders($isoa2);


}

echo json_encode($output);

?>