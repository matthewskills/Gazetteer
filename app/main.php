<?php

ini_set('display_errors', 'on');
error_reporting(E_ALL);

////////////////
// FUNCTIONS //
//////////////

function getCountryBorders($isoa2) {
    $returnedData = json_decode(file_get_contents('../dist/countryBorders.geo.json'), true);
    foreach($returnedData['features'] as $country) {
        if  ($country['properties']['iso_a2'] == $isoa2) {
            $output['countryBorder']['type'] = $country['type'];
            $output['countryBorder']['properties'] = $country['properties'];
            $output['countryBorder']['geometry'] = $country['geometry'];
            return $output['countryBorder'];
        }
    }
}


function getCountryList() {
    $returnedData = json_decode(file_get_contents('../dist/countryBorders.geo.json'), true); 
    $countryCount = count($returnedData['features']);
    $countryList = array();
    foreach ($returnedData['features'] as $feature) {

        $temp = null;
        $temp['code'] = $feature["properties"]['iso_a2'];
        $temp['name'] = $feature["properties"]['name'];

        array_push($countryList, $temp);
        
    }


    usort($countryList, function($item1, $item2) {
            return $item1['name'] <=> $item2['name'];
            });

    return $countryList;
    
}

function exchangeRates($currencyCode) {
    $url = 'https://api.exchangeratesapi.io/latest?base='.$currencyCode.'';
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_URL, $url);
    $result = curl_exec($ch);
    curl_close($ch);
    $returnedData = json_decode($result,true); 
    if (isset($returnedData['rates'])) {
    return $returnedData['rates'];
    } else {
    return '';
    }
}

function countryInfo($isoa2) {
    $url = 'http://api.geonames.org/countryInfoJSON?formatted=true&lang=en&country='.$isoa2.'&username=mattskills&style=full';
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_URL, $url);
    $result = curl_exec($ch);
    curl_close($ch);
    $returnedData = json_decode($result,true); 
    return $returnedData['geonames'];
}

function wikiSearch($countryName) {
    $url = 'http://api.geonames.org/wikipediaSearchJSON?formatted=true&q='.urlencode($countryName).'&maxRows=10&username=mattskills&style=full';
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_URL, $url);
    $result = curl_exec($ch);
    curl_close($ch);
    $returnedData = json_decode($result,true); 
    $countResults = count($returnedData['geonames']);
    for($i=0;$i< $countResults;$i++) {
        if   ($returnedData['geonames'][$i]['title'] == urldecode($countryName)) {
            $output['wiki']['summary'] = $returnedData['geonames'][$i]['summary'];
            if (isset($returnedData['geonames'][$i]['thumbnailImg'])) { $output['wiki']['image'] = $returnedData['geonames'][$i]['thumbnailImg'];} else {
                $output['wiki']['image'] = "";
            }
            $output['wiki']['wikiUrl'] = $returnedData['geonames'][$i]['wikipediaUrl'];
            return  $output['wiki'];
        }
    }
}

function getNewsProviders($isoa2) {

    $url = 'https://newsapi.org/v2/sources?language=en&country='.$isoa2.'&apiKey=f078987008884f8aa27e5b2a38dca08d';
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_URL, $url);
    $result = curl_exec($ch);
    curl_close($ch);
    $returnedData = json_decode($result,true); 
    return $returnedData;

}

function getCountryCoords($iso2) {
    $openCageUrl = 'https://api.opencagedata.com/geocode/v1/json?key=d3916e739ef84132ac13aac0ee71da81&q='.urlencode($iso2).'';
    $ch2 = curl_init();
    curl_setopt($ch2, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch2, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch2, CURLOPT_URL, $openCageUrl);
    $openCageResult = curl_exec($ch2);
    curl_close($ch2);
    $openCageRD = json_decode($openCageResult,true); 
    return $openCageRD['results'][0]['geometry'];
}


function getCountryCode($homeCoords) {
    $openCageUrl = 'https://api.opencagedata.com/geocode/v1/json?key=d3916e739ef84132ac13aac0ee71da81&q='.urlencode($homeCoords).'';
    $ch2 = curl_init();
    curl_setopt($ch2, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch2, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch2, CURLOPT_URL, $openCageUrl);
    $openCageResult = curl_exec($ch2);
    curl_close($ch2);
    $openCageRD = json_decode($openCageResult,true); 
    $output['countryData']['homeCountryCode'] =  $openCageRD['results'][0]['components']['ISO_3166-1_alpha-2'];
    $output['countryData']['homeCountryName'] =  $openCageRD['results'][0]['components']['country'];
    return $output['countryData'];
}

function getPoi($maxLat,$maxLng,$minLat,$minLng) {

    $url = 'http://api.opentripmap.com/0.1/en/places/bbox?lon_min='.$minLng.'&lat_min='.$minLat.'&lon_max='.$maxLng.'&lat_max='.$maxLat.'&kinds=battlefields&format=geojson&apikey=5ae2e3f221c38a28845f05b6b681cb9fc12ad7d4162a7319a641dc78';
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_URL, $url);
    $result = curl_exec($ch);
    curl_close($ch);
    $returnedData = json_decode($result,true); 
    return $returnedData;

}

function getRailStations($maxLat,$maxLng,$minLat,$minLng) {

    $url = 'http://api.opentripmap.com/0.1/en/places/bbox?lon_min='.$minLng.'&lat_min='.$minLat.'&lon_max='.$maxLng.'&lat_max='.$maxLat.'&kinds=railway_stations&format=geojson&apikey=5ae2e3f221c38a28845f05b6b681cb9fc12ad7d4162a7319a641dc78';
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_URL, $url);
    $result = curl_exec($ch);
    curl_close($ch);
    $returnedData = json_decode($result,true); 
    return $returnedData;

}

function getHotels($maxLat,$maxLng,$minLat,$minLng) {

    $url = 'http://api.opentripmap.com/0.1/en/places/bbox?lon_min='.$minLng.'&lat_min='.$minLat.'&lon_max='.$maxLng.'&lat_max='.$maxLat.'&kinds=other_hotels&format=geojson&apikey=5ae2e3f221c38a28845f05b6b681cb9fc12ad7d4162a7319a641dc78';
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_URL, $url);
    $result = curl_exec($ch);
    curl_close($ch);
    $returnedData = json_decode($result,true); 
    return $returnedData;

}

function getTourist($maxLat,$maxLng,$minLat,$minLng) {

    $url = 'http://api.opentripmap.com/0.1/en/places/bbox?lon_min='.$minLng.'&lat_min='.$minLat.'&lon_max='.$maxLng.'&lat_max='.$maxLat.'&kinds=tourist_object&format=geojson&apikey=5ae2e3f221c38a28845f05b6b681cb9fc12ad7d4162a7319a641dc78';
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_URL, $url);
    $result = curl_exec($ch);
    curl_close($ch);
    $returnedData = json_decode($result,true); 
    return $returnedData;

}

function getWeather($placeName) {
    $url = 'http://api.weatherapi.com/v1/forecast.json?key=495db8373c084bac934163251210702&q='.$placeName.'&days=4';
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_URL, $url);
    $result = curl_exec($ch);
    curl_close($ch);
    $returnedData = json_decode($result,true); 
    $output['data'] = $returnedData;

    $windSpeed = $returnedData['current']['wind_mph'];
    $windDesc = null;

    switch($windSpeed) {
        case $windSpeed < 1.2:
            $windDesc = "a calm breeze";
            break;
        case $windSpeed < 3.7:
             $windDesc = "a light breeze";
            break;
        case $windSpeed < 13.0:
             $windDesc = "a gentle breeze";
            break;
        case $windSpeed < 19.3:
           $windDesc = "a moderate breeze";
            break;
        case $windSpeed < 25.5:
           $windDesc = "a fresh breeze";
            break;
        case $windSpeed < 32.0:
             $windDesc = "a strong breeze";
            break;
        case $windSpeed < 39.0:
             $windDesc = "a modetate gale";
            break;
        case $windSpeed < 47.0:
             $windDesc = "a fresh gale";
            break;
        case $windSpeed < 56.0:
             $windDesc = "a full gale";
            break;
        case $windSpeed < 65.0:
            $windDesc = "a strong gale";
            break;
        case $windSpeed < 75.0:
             $windDesc = "stormmy weather";
            break;
        deafult:
            $windDesc = "hurricane force winds";
            break;
    }

    $output['data']['current']['condition']['wind_desc'] = $windDesc;
    return $output['data'];
}


function getCities($countryName) {
    $url = 'https://mattskills.co.uk/projects/gazetteer/dist/worldcities.json';
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_URL, $url);
    $result = curl_exec($ch);
    curl_close($ch);
    $returnedData = json_decode($result,true); 
    $countResults = count($returnedData);
    $h = 0;
    for($i=0;$i< $countResults;$i++) {
        if   ($returnedData[$i]['country'] == urldecode($countryName) && $returnedData[$i]['population'] > 100000) {
            $output['cities'][$h] = $returnedData[$i];  
            $h++ ;
        }
    }

    if (isset($output['cities'])) {
        return  $output['cities'];
        } else {
        return 'none';
        }
}

///////////////



$output['status']['code'] = "200";
$output['status']['name'] = "ok"; 
header('Content-Type: application/json; charset=UTF-8');


if (isset($_REQUEST['requestType'])) {$requestType=  $_REQUEST['requestType'];} else { $requestType = null;}
if (isset($_REQUEST['code'])) {$iso2=  $_REQUEST['code'];} else { $iso2 = null;}
if (isset($_REQUEST['countryName'])) {$countryName= $_REQUEST['countryName'] ;} else { $countryName = null; }

if (isset ($_REQUEST['homeCoords'])) {
    //openCage reverse
    $output['homeCountryData'] = getCountryCode($_REQUEST['homeCoords']);
} elseif ($requestType =="initial") {

    //openCage
    $output['coords'] = getCountryCoords($iso2);

    $lat= $output['coords']['lat'] ;
    $lng= $output['coords']['lng'] ;

    //countryBorders
    $output['countryBorders'] = getCountryBorders($iso2);
    $output['countryList'] = getCountryList();

} else {

//openCage
$output['coords'] = getCountryCoords($iso2);

$lat= $output['coords']['lat'] ;
$lng= $output['coords']['lng'] ;

//countryBorders
$output['countryBorders'] = getCountryBorders($iso2);
$output['countryList'] = getCountryList();

$countryName = $output['countryBorders']['properties']['name'];

//geonames
$output['countryInfo'] = countryInfo($iso2);
$currencyCode = $output['countryInfo'][0]['currencyCode'];
$output['wiki'] = wikiSearch($countryName);

$output['cities'] = getCities($countryName);

//exchange rates
$output['exchangeRates'] = exchangeRates($currencyCode);

//open weather map
$output['weather'] = getWeather($output['countryInfo'][0]['capital']);

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

$output['newsProviders'] = getNewsProviders($iso2);


}

echo json_encode($output);

?>