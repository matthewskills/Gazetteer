<?php

function getWeather($countryName) {
    $curl = curl_init();

    curl_setopt_array($curl, [
        CURLOPT_URL => "https://community-open-weather-map.p.rapidapi.com/weather?q=".urlencode($countryName)."&lat=0&lon=0&id=2172797&lang=null&units=metric",
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_ENCODING => "",
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => "GET",
        CURLOPT_HTTPHEADER => [
            "x-rapidapi-host: community-open-weather-map.p.rapidapi.com",
            "x-rapidapi-key: ############################################"
        ],
    ]);
    
    $response = curl_exec($curl);
    $err = curl_error($curl);
    
    curl_close($curl);
    $output['weather'] = json_decode($response);
    
    if ($err) {
        echo "cURL Error #:" . $err;
    } else {
        return  $output['weather'];
    }
}






