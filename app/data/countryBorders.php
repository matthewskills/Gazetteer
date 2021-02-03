<?php

function getCountryBorders($countryName) {

    $url = 'https://mattskills.co.uk/projects/gazetteer/dist/countryBorders.geo.json';
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_URL, $url);
    $result = curl_exec($ch);
    curl_close($ch);
    $returnedData = json_decode($result,true); 

    foreach($returnedData['features'] as $country) {
        if  ($key = array_search($countryName, $country['properties'])) {
            $output['countryBorder']['type'] = $country['type'];
            $output['countryBorder']['properties'] = $country['properties'];
            $output['countryBorder']['geometry'] = $country['geometry'];

            return $output['countryBorder'];
        }
    }

  

}

function getCountryList() {

    $url = 'https://mattskills.co.uk/projects/gazetteer/dist/countryBorders.geo.json';
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_URL, $url);
    $result = curl_exec($ch);
    curl_close($ch);
    $returnedData = json_decode($result,true); 

    $countryCount = count($returnedData['features']);
    $countryList = array();

    for ($i=0; $i<$countryCount; $i++) {
        $countryList[$i] = $returnedData['features'][$i]['properties']['name'];
    }

    return $countryList;

}

