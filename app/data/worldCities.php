<?php 

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