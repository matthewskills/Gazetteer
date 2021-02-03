<?php

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