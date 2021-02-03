<?php

function getCountryCoords($countryName) {
    $openCageUrl = 'https://api.opencagedata.com/geocode/v1/json?key=d3916e739ef84132ac13aac0ee71da81&q='.urlencode($countryName).'';
    $ch2 = curl_init();
    curl_setopt($ch2, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch2, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch2, CURLOPT_URL, $openCageUrl);
    $openCageResult = curl_exec($ch2);
    curl_close($ch2);
    $openCageRD = json_decode($openCageResult,true); 
    return $openCageRD['results'][0]['geometry'];
}


function getCountryName($homeCoords) {
    $openCageUrl = 'https://api.opencagedata.com/geocode/v1/json?key=d3916e739ef84132ac13aac0ee71da81&q='.urlencode($homeCoords).'';
    $ch2 = curl_init();
    curl_setopt($ch2, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch2, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch2, CURLOPT_URL, $openCageUrl);
    $openCageResult = curl_exec($ch2);
    curl_close($ch2);
    $openCageRD = json_decode($openCageResult,true); 
    return $openCageRD['results'][0]['components']['country'];
}