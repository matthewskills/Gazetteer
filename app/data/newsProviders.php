<?php

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