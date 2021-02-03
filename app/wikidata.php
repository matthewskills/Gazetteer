<?php

    ini_set('display_errors', 'on');
    error_reporting(E_ALL);

    $query= $_REQUEST['dataId'] ;

    $url = 'https://www.wikidata.org/w/api.php?action=wbgetentities&ids='.$query.'&props=descriptions&format=json';

    $ch = curl_init();

    // disables ssl certificate verification
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    // causes the result to be outputted to the page when false.
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    curl_setopt($ch, CURLOPT_URL, $url);

    $result = curl_exec($ch);

    curl_close($ch);
    
    $returnedData = json_decode($result,true); 


    $output['status']['code'] = "200";
    $output['status']['name'] = "ok"; 
    $output['wikidata'] = $returnedData['entities'];

    header('Content-Type: application/json; charset=UTF-8');

    echo json_encode($output);


?>