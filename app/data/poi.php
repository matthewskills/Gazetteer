<?php 

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

        $url = 'http://api.opentripmap.com/0.1/en/places/bbox?lon_min='.$minLng.'&lat_min='.$minLat.'&lon_max='.$maxLng.'&lat_max='.$maxLat.'&kinds=railway_stations&format=geojson&apikey=##########';
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

        $url = 'http://api.opentripmap.com/0.1/en/places/bbox?lon_min='.$minLng.'&lat_min='.$minLat.'&lon_max='.$maxLng.'&lat_max='.$maxLat.'&kinds=other_hotels&format=geojson&apikey=#########';
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

        $url = 'http://api.opentripmap.com/0.1/en/places/bbox?lon_min='.$minLng.'&lat_min='.$minLat.'&lon_max='.$maxLng.'&lat_max='.$maxLat.'&kinds=tourist_object&format=geojson&apikey=###########';
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_URL, $url);
        $result = curl_exec($ch);
        curl_close($ch);
        $returnedData = json_decode($result,true); 
        return $returnedData;

}

