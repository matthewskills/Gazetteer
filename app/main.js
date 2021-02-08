var websiteUrl = window.location.href;
var splitWebsiteUrl = websiteUrl.split(":");
var protocol = splitWebsiteUrl[0];


let mymap

var Stadia_AlidadeSmoothDark = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
});

var Stadia_Outdoors = L.tileLayer('https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.png', {
maxZoom: 20,
attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
});


const cityIcon = L.icon({
    iconUrl: './app/markers/city.png',
    iconSize:     [34, 34], // size of the icon

});
const battleIcon = L.icon({
    iconUrl: './app/markers/battle.png',
    iconSize:     [34, 34], // size of the icon
});

const railIcon = L.icon({
    iconUrl: './app/markers/trains.png',
    iconSize:     [34, 34], // size of the icon
});
const hotelsIcon = L.icon({
    iconUrl: './app/markers/hotels.png',
    iconSize:     [34, 34], // size of the icon
});
const touristsIcon = L.icon({
    iconUrl: './app/markers/tourist.png',
    iconSize:     [34, 34], // size of the icon
});

var baseMaps = {
    "Light Mode": Stadia_Outdoors,
    "Dark Mode": Stadia_AlidadeSmoothDark
};

let coords,countryBorders,countryList

async function setMap(ctry) {

 await   $.ajax({
        url: 'https://mattskills.co.uk/projects/gazetteer/app/main.php',
        type: 'POST',
        dataType: 'json',
        data: {requestType: 'initial', code: ctry },
        success: result => {

            coords = result['coords'];
            countryBorders = result['countryBorders'];
            countryList = result['countryList'];

            mymap = L.map('map', {
                layers: [Stadia_AlidadeSmoothDark, Stadia_Outdoors]
            })

            mymap.setView([coords['lat'], coords['lng']],10);

           

            L.geoJSON(countryBorders, {
                style: {color: "#ff0047", fillColor: "#0078ff"} 
            }).addTo(mymap);

            bounds =  L.geoJSON(countryBorders).getBounds();
            mymap.fitBounds(bounds, {padding: [50,50]})
            
             $('#countriesDataList').append(`<option value="${countryBorders['properties']['iso_a2']}" selected="selected">${countryBorders['properties']['name']}</option>`)
            countryList.forEach( (country) => {
                let opt = document.createElement("option");
                opt.value = country['code'];
                opt.text = country['name'];
                document.getElementById("countriesDataList").appendChild(opt,null);
            });
           
            
              
        }
    }).then ( async function() {
     await   $.ajax({
            url: 'https://mattskills.co.uk/projects/gazetteer/app/main.php',
            type: 'POST',
            dataType: 'json',
            data: { code: ctry },
            success: result => {
                const wiki = result['wiki'];
            let wikiSummary
            let wikiThumbnail
            try {
            const wikiLink = `( <a href="https://${wiki['wikiUrl']}" target="_blank">Read More</a> )`;
            wikiSummary = wiki['summary'].replace('(...)', wikiLink );
            wikiThumbnail = ` <img src="${wiki['image'].replace("http://", "https://")}" alt="${ctry}" height="100" />` 
            } catch(err) {
                wikiSummary = "<small>Sorry, Couldn't find data from Wikipedia</small>";
                wikiThumbnail = ''
            }

            const countryInfo = result['countryInfo'][0];
            const cities = result['cities'];
            const exchangeRates = result['exchangeRates'];
            const weather = result['weather'];
            const poi = result['poi']['features'];
            const railStations = result['railStations']['features'];
            const hotels = result['hotels']['features'];
            const touristSpots = result['touristSpots']['features'];
            const newsProviders = result['newsProviders']['sources'];

             
            let windSpeed = weather['current']['wind_mph']
            let windDesc
            


            L.easyButton( '<svg viewBox="0 0 31 30" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>', function(){
                countryMarkerOnClick();
              }).addTo(mymap);

            
            function countryMarkerOnClick() {

              
             
            $("#countryInfoBoxLabel").html(`<img src="https://www.countryflags.io/${countryInfo['countryCode']}/flat/64.png"> ${countryBorders['properties']['name']} - ${ctry}  `)
            $("#countryInfoBoxBody").html(`
            <p class="modalList" >
            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            <strong>Capital City:</strong> ${countryInfo['capital']}
            </p>
            <p class="modalList" >
            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            <strong>Continent:</strong> ${countryInfo['continentName']}
            </p>
            <p class="modalList" >
            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            <strong>Population:</strong> ${countryInfo['population']}
            </p>
            <p class="modalList" id="wikiSummary">
            ${wikiThumbnail}
            ${wikiSummary}
            </p>`);
            $('#countryInfoBox').modal('show');
            }


            L.easyButton( '<svg viewBox="0 0 31 30" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>', function(){

                $("#currencyInfoBoxBody").html(``); 

                if (exchangeRates['CAD']) {
                $("#currencyInfoBoxBody").html(`<p>1 ${countryInfo['currencyCode']} equals </p>`);
                $("#datalistCurrencies").show();
                $("#exchangeRateSet").closest('div').show();
                    $("#exchangeRateSet").html(`${parseFloat(exchangeRates['CAD']).toFixed(2)}`);
                    for (const property in exchangeRates) {
                        let opt = document.createElement("option");
                        opt.value = parseFloat(exchangeRates[property]).toFixed(2);
                        opt.text = property;
                        document.getElementById("datalistCurrencies").appendChild(opt,null);
                    }
                } else {
                    $("#currencyInfoBoxBody").html(`Sorry, we couldn't compare the currency <strong>${countryInfo['currencyCode']}</strong> to anything.`);
                    $("#datalistCurrencies").hide();
                    $("#exchangeRateSet").closest('div').hide();
                }
              

                $('#currencyInfoBox').modal('show');
                
            }).addTo(mymap);

            
            L.easyButton( '<svg viewBox="0 0 31 30" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1"><path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"></path></svg>', function(){
                $("#countryInfoBoxLabel").html(`Weather in ${countryInfo['capital']}`);
                

            if (weather['forecast']) {

                const day1 = new Date(weather['forecast']['forecastday'][1]['date']);
                const day2 = new Date(weather['forecast']['forecastday'][2]['date']);

                $("#countryInfoBoxBody").html(`
               
                <div class="row">
                    <h5>Today</h5>
                    <div class="col-sm weatherTemp">
                    <img src="${weather['current']['condition']['icon']}" alt="${weather['current']['condition']['text']}" height="64px" />
                    <p><strong>${weather['forecast']['forecastday'][0]['day']['maxtemp_c']}&deg;c</strong></p>
                    <p>${weather['forecast']['forecastday'][0]['day']['mintemp_c']}&deg;c</p>
                    </div>
                    <div class="col-sm">
                    ${weather['current']['condition']['text']} and ${weather['current']['condition']['wind_desc']}.
                    </div>
                </div>

                <div class="row weatherForecastRow">
                    <div class="col-sm weatherForecastCol">
                    <h5>${day1.toDateString()}</h5>
                    <img src="${weather['forecast']['forecastday'][1]['day']['condition']['icon']}" alt="${weather['current']['condition']['text']}" height="64px" />
                    <p><strong>${weather['forecast']['forecastday'][1]['day']['maxtemp_c']}&deg;c</strong></p>
                    <p>${weather['forecast']['forecastday'][1]['day']['mintemp_c']}&deg;c</p>
                    </div>
                    <div class="col-sm weatherForecastCol" style="border-right:0px;">
                    <h5>${day2.toDateString()}</h5>
                    <img src="${weather['forecast']['forecastday'][2]['day']['condition']['icon']}" alt="${weather['current']['condition']['text']}" height="64px" />
                    <p><strong>${weather['forecast']['forecastday'][2]['day']['maxtemp_c']}&deg;c</strong></p>
                    <p>${weather['forecast']['forecastday'][2]['day']['mintemp_c']}&deg;c</p>
                    </div>
                </div>
            
                
                `);
            } else {
                $("#countryInfoBoxBody").html(`<p>Sorry, we don't know what the weather is like in ${ctry}.</p>`);
            }
                $('#countryInfoBox').modal('show');
              }).addTo(mymap);
              

              L.easyButton( '<svg viewBox="0 0 31 30" width="24" height="24"  stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>', function(){
                $("#newsInfoBoxLabel").html(`News Providers in ${ctry}`);
                $('#newsInfoBoxBody').html(``);
                if (newsProviders[0]) {
                newsProviders.forEach( (item,index) => {
                    let opt = document.createElement("li");
                    opt.className = "list-group-item";

                    opt.innerHTML = `
                    <h5>${newsProviders[index]['name']}</h5>
                    <p>${newsProviders[index]['description']}</p>
                    <p><a href="${newsProviders[index]['url']}" class="btn btn-light btn-sm" target="_blank">Visit Website</a></p>
                    `
                    document.getElementById("newsInfoBoxBody").appendChild(opt,null);
                })  } else {
                    $('#newsInfoBoxBody').html(`<p>Sorry, we couldn't find any news providers in ${ctry}.</p>`);
                }

                $('#newsInfoBox').modal('show');
              }).addTo(mymap);
             

              const cityMarkers = L.markerClusterGroup();
              if(cities[0]['lat']) {
            cities.forEach( (item,index) => {
                cityMarkers.addLayer(L.marker([cities[index]['lat'], cities[index]['lng']], {icon: cityIcon}).bindTooltip(`
                <strong>${cities[index]['city']} - ${cities[index]['iso2']} </strong>
                `, {
                    className: 'tooltips',
                    direction: 'top'
                }))
            })
        } 


            const battleMarkers = L.markerClusterGroup();
            if(poi) {
            poi.forEach( (item,index) => { 
                battleMarkers.addLayer(L.marker([poi[index]['geometry']['coordinates'][1], poi[index]['geometry']['coordinates'][0]],{icon: battleIcon}).bindTooltip(`
                <strong>${poi[index]['properties']['name']}</strong>
                `, {
                    className: 'tooltips',
                    direction: 'top'
                }))

            }) }
            

            const railwayMarkers = L.markerClusterGroup();

            if(railStations) {
            railStations.forEach( (item,index) => { 
                railwayMarkers.addLayer(L.marker([railStations[index]['geometry']['coordinates'][1], railStations[index]['geometry']['coordinates'][0]],{icon: railIcon}).bindTooltip(`
                <strong>${railStations[index]['properties']['name']}</strong>
                `, {
                    className: 'tooltips',
                    direction: 'top'
                }))

            }) }
            

            const hotelsMarkers = L.markerClusterGroup();

            if(hotels) {
            hotels.forEach( (item,index) => { 
                hotelsMarkers.addLayer(L.marker([hotels[index]['geometry']['coordinates'][1], hotels[index]['geometry']['coordinates'][0]],{icon: hotelsIcon}).bindTooltip(`
                <strong>${hotels[index]['properties']['name']}</strong>
                `, {
                    className: 'tooltips',
                    direction: 'top'
                }))

            }) }
            

            const touristSpotsMarkers = L.markerClusterGroup();

            if(touristSpots) {
            touristSpots.forEach( (item,index) => { 
                touristSpotsMarkers.addLayer(L.marker([touristSpots[index]['geometry']['coordinates'][1], touristSpots[index]['geometry']['coordinates'][0]],{icon: touristsIcon}).bindTooltip(`
                <strong>${touristSpots[index]['properties']['name']}</strong>
                `, {
                    className: 'tooltips',
                    direction: 'top'
                }))

            }) }
            

            touristSpotsMarkers.addTo(mymap);
            cityMarkers.addTo(mymap);
            battleMarkers.addTo(mymap);
            railwayMarkers.addTo(mymap);
            hotelsMarkers.addTo(mymap);
            touristSpotsMarkers.addTo(mymap);

            var overlayMaps = {
                "Cities": cityMarkers,
                "Historic Battles": battleMarkers,
                "Railway Stations": railwayMarkers,
                "hotels": hotelsMarkers,
                "Tourist Attractions": touristSpotsMarkers
            };
            L.control.layers(baseMaps,overlayMaps).addTo(mymap);
            }
        })
        
    }).then (() => {
        $('.spinnerContainer').fadeOut('slow');
        
    })
}


function setCurrency(value) {
    $("#exchangeRateSet").html(value);
}

function getDescription(wikidata) {
    $.ajax({
        url: 'https://mattskills.co.uk/projects/gazetteer/app/wikidata.php',
        type: 'POST',
        dataType: 'json',
        data: { dataId: wikidata },
            success: result => {
                if( result['wikidata'][wikidata]['descriptions']['en']['value'] ) {
                $("#countryInfoBoxBody").html(`${result['wikidata'][wikidata]['descriptions']['en']['value']}`);
                } else {
                    $("#countryInfoBoxBody").html(`${result['wikidata'][wikidata]['descriptions']['value']}`);
                }
               
            }
        })
}

if('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition((position) => {

        $.ajax({
            url: 'https://mattskills.co.uk/projects/gazetteer/app/main.php',
            type: 'POST',
            dataType: 'json',
            data: { homeCoords: position.coords.latitude+' '+position.coords.longitude},
                success: result => {

                    setMap(result['homeCountryData']['homeCountryCode']);
                
                }
            })
      });
} else {

    setMap('GB');
}

$(document).ready( () => {
       
    $('#changeCountry').on('click', () => {

        if ($('#countriesDataList').val() == '') {
        } else {
        mymap.remove();
        setMap($('#countriesDataList').val());
        $('.spinnerContainer').fadeIn('fast');
        }
    })  

    $('#countriesDataList').on('change',  () => {
        if ($('#countriesDataList').val() == '') {
        } else {
        mymap.remove();
        setMap($('#countriesDataList').val());
        $('.spinnerContainer').fadeIn('fast');
        }
    })

})

