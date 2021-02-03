<?php 

function countryInfo($isoa2) {
    $url = 'http://api.geonames.org/countryInfoJSON?formatted=true&lang=en&country='.$isoa2.'&username=#####&style=full';
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
    $url = 'http://api.geonames.org/wikipediaSearchJSON?formatted=true&q='.urlencode($countryName).'&maxRows=10&username=####&style=full';
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
